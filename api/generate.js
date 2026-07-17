export const config = { supportsResponseStreaming: true };

// ─── Rate limiting ────────────────────────────────────────────────────────────
// 10 recipes per 15 minutes per IP. In-memory: resets on cold starts, which is
// fine — the goal is blunting rapid-fire abuse, not perfect accounting.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map(); // ip → array of timestamps

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // housekeeping so the map never grows unbounded
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every(t => now - t > WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: "You've hit the recipe limit (10 per 15 minutes). Take a breather and try again soon 🌶",
    });
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
  if (typeof prompt !== 'string' || prompt.length > 4000) {
    return res.status(400).json({ error: 'Prompt too long' });
  }

  const MODEL = 'gemini-3-flash-preview';
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

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let sseBuf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      sseBuf += decoder.decode(value, { stream: true });
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
        } catch {}
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