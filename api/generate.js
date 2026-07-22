export const config = { supportsResponseStreaming: true };

const MAX_PER_WINDOW = 10; // recipes per 15-minute window per IP

// Shared rate limit check — calls the Postgres function so the count is
// accurate across ALL Vercel instances. Fails open: if the check itself
// errors, we allow the request rather than break recipe generation.
async function isAllowed(ip) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return true; // not configured → don't block

  try {
    const r = await fetch(`${url}/rest/v1/rpc/check_rate_limit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({ p_ip: ip, p_max: MAX_PER_WINDOW }),
    });
    if (!r.ok) return true;
    const allowed = await r.json();
    return allowed === true;
  } catch {
    return true;
  }
}

export default async function handler(req, res) {
  // ── CORS: allow requests from our own domains (the app can be loaded from
  // any of these, but the API lives on the vercel deployment) ──
  const allowedOrigins = [
    'https://www.spicesight.app',
    'https://spicesight.app',
    'https://spicesight.vercel.app',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  const allowed = await isAllowed(ip);
  if (!allowed) {
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

  const PRIMARY = 'gemini-3-flash-preview';
  const FALLBACK = 'gemini-flash-lite-latest';

  // Key travels in a header, not the URL — URLs end up in logs far more often
  const callGemini = (model) => fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  // Translate Google's error walls into something a human wants to read
  const friendly = (status, msg) => {
    const m = (msg || '').toLowerCase();
    if (status === 429 || m.includes('quota'))
      return "The kitchen is busy right now — please try again in a minute 🌶";
    if (status === 503 || m.includes('high demand') || m.includes('overloaded'))
      return "The chef is swamped at the moment — give it a few seconds and try again 👨‍🍳";
    return msg || 'Recipe generation failed — please try again.';
  };

  try {
    let upstream = await callGemini(PRIMARY);

    // Primary overloaded or throttled by Google? Silently try the lighter model.
    if (!upstream.ok && (upstream.status === 429 || upstream.status === 503)) {
      console.warn('Primary model unavailable (', upstream.status, ') — trying fallback');
      upstream = await callGemini(FALLBACK);
    }

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      const raw = err?.error?.message || 'Gemini API request failed';
      console.error('Gemini API error:', upstream.status, raw);
      return res.status(upstream.status).json({ error: friendly(upstream.status, raw) });
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
          const parts = json?.candidates?.[0]?.content?.parts || [];
          for (const p of parts) {
            // Skip "thinking" parts — only stream the actual answer text
            if (p?.text && !p?.thought) res.write(p.text);
          }
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