// /api/check-deletion  —  called right after sign-in.
//
// Looks at whether THIS user has a pending deletion:
//   • grace period still active  → returns { scheduled:true, purgeAt } so the
//     app can show the "your account is scheduled for deletion" screen.
//   • grace period expired (>14 days) → permanently deletes recipes + auth
//     record now, and returns { purged:true }.
//   • no pending deletion → returns { scheduled:false }.
//
// Security: verifies the caller's access token; acts only on that user.

const GRACE_DAYS = 14;

async function getUserId(url, serviceKey, token) {
  const r = await fetch(`${url}/auth/v1/user`, {
    headers: { 'Authorization': `Bearer ${token}`, 'apikey': serviceKey },
  });
  if (!r.ok) return null;
  const u = await r.json();
  return u?.id || null;
}

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://www.spicesight.app',
    'https://spicesight.app',
    'https://spicesight.vercel.app',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) return res.status(200).json({ scheduled: false }); // fail open

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not signed in.' });

  const svcHeaders = {
    'Content-Type': 'application/json',
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
  };

  try {
    const userId = await getUserId(url, serviceKey, token);
    if (!userId) return res.status(401).json({ error: 'Invalid session.' });

    // Is there a pending deletion for this user?
    const r = await fetch(`${url}/rest/v1/pending_deletions?user_id=eq.${userId}&select=scheduled_at`, { headers: svcHeaders });
    const rows = r.ok ? await r.json() : [];
    if (rows.length === 0) return res.status(200).json({ scheduled: false });

    const scheduledAt = new Date(rows[0].scheduled_at);
    const purgeAt = new Date(scheduledAt.getTime() + GRACE_DAYS * 86400000);

    if (Date.now() < purgeAt.getTime()) {
      // still within grace period
      return res.status(200).json({ scheduled: true, purgeAt: purgeAt.toISOString() });
    }

    // Grace period expired → permanently delete everything now.
    await fetch(`${url}/rest/v1/recipes?user_id=eq.${userId}`, { method: 'DELETE', headers: svcHeaders });
    await fetch(`${url}/rest/v1/pending_deletions?user_id=eq.${userId}`, { method: 'DELETE', headers: svcHeaders });
    await fetch(`${url}/auth/v1/admin/users/${userId}`, { method: 'DELETE', headers: svcHeaders });

    return res.status(200).json({ purged: true });
  } catch (e) {
    // On error, don't block the user — treat as not scheduled
    return res.status(200).json({ scheduled: false });
  }
}
