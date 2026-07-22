// /api/delete-user  —  manages account deletion with a 14-day grace period.
//
// Actions (sent as { action } in the JSON body):
//   "schedule"   → mark the account for deletion in 14 days (default)
//   "reactivate" → cancel a pending deletion
//   "status"     → report whether/when this account is scheduled for deletion
//
// Permanent removal after 14 days happens via /api/check-deletion, which is
// called on sign-in and purges the account if its grace period has expired.
//
// Security: the client sends its Supabase access token. We verify it to learn
// which user is calling, then act only on THAT user. The service-role key is
// server-only, so a user can never affect anyone else's account.

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
  if (!url || !serviceKey) return res.status(500).json({ error: 'Server not configured.' });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not signed in.' });

  let action = 'schedule';
  try {
    const body = (typeof req.body === 'object' && req.body) ? req.body : JSON.parse(req.body || '{}');
    if (body.action) action = body.action;
  } catch { /* keep default */ }

  const svcHeaders = {
    'Content-Type': 'application/json',
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
  };

  try {
    const userId = await getUserId(url, serviceKey, token);
    if (!userId) return res.status(401).json({ error: 'Invalid or expired session.' });

    if (action === 'status') {
      const r = await fetch(`${url}/rest/v1/pending_deletions?user_id=eq.${userId}&select=scheduled_at`, { headers: svcHeaders });
      const rows = r.ok ? await r.json() : [];
      if (rows.length > 0) {
        const scheduledAt = new Date(rows[0].scheduled_at);
        const purgeAt = new Date(scheduledAt.getTime() + GRACE_DAYS * 86400000);
        return res.status(200).json({ scheduled: true, scheduledAt: rows[0].scheduled_at, purgeAt: purgeAt.toISOString() });
      }
      return res.status(200).json({ scheduled: false });
    }

    if (action === 'reactivate') {
      await fetch(`${url}/rest/v1/pending_deletions?user_id=eq.${userId}`, { method: 'DELETE', headers: svcHeaders });
      return res.status(200).json({ success: true, reactivated: true });
    }

    // default: schedule deletion (upsert a pending_deletions row)
    await fetch(`${url}/rest/v1/pending_deletions`, {
      method: 'POST',
      headers: { ...svcHeaders, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ user_id: userId, scheduled_at: new Date().toISOString() }),
    });
    const purgeAt = new Date(Date.now() + GRACE_DAYS * 86400000).toISOString();
    return res.status(200).json({ success: true, scheduled: true, purgeAt });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' });
  }
}
