// POST /api/contact: emails a brief from the contact page to the studio.
//
// Runs as a Vercel serverless function and sends through Resend
// (https://resend.com). The studio's address lives only in Vercel's
// environment settings, never in this public repository:
//
//   RESEND_API_KEY  the API key from Resend
//   CONTACT_TO      the inbox that receives briefs
//   CONTACT_FROM    optional sender, once a domain is verified in Resend.
//                   Until then Resend's own test sender is used, which can
//                   only deliver to the email the Resend account was opened with.

const LIMITS = { name: 120, company: 160, email: 200, interest: 60, message: 5000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  // Only the site's own pages may post here.
  const origin = req.headers.origin;
  if (origin) {
    let host = '';
    try { host = new URL(origin).host; } catch (e) { /* malformed origin */ }
    if (host !== req.headers.host) return res.status(403).json({ ok: false, error: 'origin' });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    console.error('contact: RESEND_API_KEY or CONTACT_TO is not set');
    return res.status(503).json({ ok: false, error: 'not-configured' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  // The hidden "website" field is left empty by people and filled by bots.
  // Answer bots as if it worked, and send nothing.
  if (body.website) return res.status(200).json({ ok: true });

  const f = {};
  for (const [field, max] of Object.entries(LIMITS)) f[field] = String(body[field] ?? '').trim().slice(0, max);
  if (!f.name || !f.message || !EMAIL.test(f.email)) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }

  const rows = [
    ['Name', f.name],
    ['Brand / company', f.company || '(not given)'],
    ['Email', f.email],
    ['Looking for', f.interest || '(not given)'],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n${f.message}\n`;
  const html =
    '<table style="font:14px/1.5 Arial,sans-serif;border-collapse:collapse">' +
    rows.map(([k, v]) => `<tr><td style="padding:2px 16px 2px 0;color:#7A6A5C">${k}</td><td>${escape(v)}</td></tr>`).join('') +
    '</table>' +
    `<p style="font:15px/1.6 Arial,sans-serif;white-space:pre-wrap;margin-top:18px">${escape(f.message)}</p>`;

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'DARIA website <onboarding@resend.dev>',
      to: [to],
      reply_to: f.email, // pressing Reply answers the person who wrote
      subject: `New brief: ${f.company || f.name}`.slice(0, 150),
      text,
      html,
    }),
  }).catch((e) => ({ ok: false, status: 0, text: async () => JSON.stringify({ name: 'network_error', message: String(e) }) }));

  if (!sent.ok) {
    const raw = await sent.text();
    console.error('contact: Resend refused the email', sent.status, raw);
    // Pass back Resend's error code (e.g. "validation_error") so a failed send
    // can be diagnosed from the browser, but never its message, which can
    // quote email addresses.
    let reason = 'unknown';
    try { reason = JSON.parse(raw).name || reason; } catch (e) { /* not JSON */ }
    if (!/^[a-z_]{1,40}$/.test(reason)) reason = 'unknown';
    return res.status(502).json({ ok: false, error: 'send-failed', reason, status: sent.status });
  }
  return res.status(200).json({ ok: true });
};
