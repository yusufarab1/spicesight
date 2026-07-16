export const config = { supportsResponseStreaming: true };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server misconfigured: GEMINI_API_KEY not found. Add it in Vercel → Settings → Environment Variables, then redeploy.'
    });
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  const MODEL = 'gemini-3-flash-preview';
  // streamGenerateContent with alt=sse gives us Server-Sent Events chunks
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      console.error('Gemini API error:', upstream.status, JSON.stringify(err));
      return res.status(upstream.status).json({
        error: err?.error?.message || 'Gemini API request failed',
      });
    }

    // Stream plain text chunks to the client as they arrive
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let sseBuf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      sseBuf += decoder.decode(value, { stream: true });

      // SSE format: lines like "data: {...json chunk...}"
      let nl;
      while ((nl = sseBuf.indexOf('\n')) !== -1) {
        const line = sseBuf.slice(0, nl).trim();
        sseBuf = sseBuf.slice(nl + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const json = JSON.parse(payload);
          const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) res.write(text);
        } catch {
          // partial frame — ignore, it completes on a later read
        }
      }
    }

    res.end();
  } catch (err) {
    console.error('Proxy error:', err);
    try {
      res.status(500).json({ error: 'Failed to reach Gemini: ' + err.message });
    } catch {
      res.end();
    }
  }
}