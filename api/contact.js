// Vercel serverless function: receives the contact forms and emails them via Resend.
// Needs the environment variable RESEND_API_KEY (set in Vercel, never in the site files).
// Optional: CONTACT_TO (default burhan@magolabs.in), CONTACT_FROM (default Mago Labs Trades <forms@magolabs.in>).
const esc = s => String(s || '').slice(0, 4000).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b) } catch (e) { b = {} } }

  if (b.website) return res.status(200).json({ ok: true }); // hidden honeypot field: bots fill it, people don't
  const email = String(b.email || '').trim();
  if (!String(b.name || '').trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Name and a valid email are needed.' });
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ ok: false, error: 'Email is not set up yet.' });

  const fields = [['Name', b.name], ['Email', email], ['Phone / WhatsApp', b.phone], ['Business or Instagram', b.business], ['Trade', b.trade], ['Country', b.country], ['Message', b.message], ['Sent from page', b.page]];
  const rows = fields.filter(f => f[1]).map(f => `<tr><td style="padding:8px 14px 8px 0;color:#6b6b6b;vertical-align:top;white-space:nowrap">${f[0]}</td><td style="padding:8px 0;color:#0d0d0d">${esc(f[1]).replace(/\n/g, '<br>')}</td></tr>`).join('');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px"><h2 style="margin:0 0 12px">New enquiry from trades.magolabs.in</h2><table style="border-collapse:collapse">${rows}</table></div>`;
  const text = fields.filter(f => f[1]).map(f => `${f[0]}: ${f[1]}`).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Mago Labs Trades <forms@magolabs.in>',
        to: [process.env.CONTACT_TO || 'burhan@magolabs.in'],
        reply_to: email,
        subject: `New enquiry: ${String(b.name).slice(0, 60)}${b.trade ? ' (' + String(b.trade).slice(0, 40) + ')' : ''}`,
        html, text
      })
    });
    if (!r.ok) { console.error('Resend error', r.status, await r.text()); return res.status(502).json({ ok: false }); }
    return res.status(200).json({ ok: true });
  } catch (e) { console.error(e); return res.status(502).json({ ok: false }); }
};
