const { Resend } = require('resend');

const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

const FROM = 'Loknath Solution <onboarding@resend.dev>';

// ─── OTP email ────────────────────────────────────────────────
const sendOTPEmail = async ({ email, otp, isNew }) => {
  const resend = getResend();
  if (!resend) {
    console.log(`\n📧 OTP (Resend not configured)\n   To: ${email}\n   OTP: ${otp}\n`);
    return;
  }
  await resend.emails.send({
    from: FROM, to: email,
    subject: `${otp} — Your Login Code for Loknath Solution`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0a925d,#2563eb);padding:28px;text-align:center;">
          <h2 style="color:white;margin:0;">🔐 Your Login Code</h2>
        </div>
        <div style="padding:32px;text-align:center;">
          <p style="color:#334155;">${isNew ? 'Welcome! Use this code to create your account.' : 'Use this code to sign in.'}</p>
          <div style="background:#f8fafc;border:2px dashed #0a925d;border-radius:12px;padding:24px;margin:16px auto;">
            <p style="color:#64748b;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your OTP</p>
            <p style="color:#0a925d;font-size:42px;font-weight:900;letter-spacing:12px;margin:0;font-family:monospace;">${otp}</p>
          </div>
          <p style="color:#854d0e;background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:12px;font-size:13px;">
            ⏰ Expires in 10 minutes · Never share this code with anyone
          </p>
        </div>
      </div>`,
  });
};

// ─── Contact form notification ─────────────────────────────────
const sendContactNotification = async ({ name, email, phone, subject, message }) => {
  const resend = getResend();
  if (!resend) {
    console.log('⚠️  RESEND_API_KEY not set — skipping contact notification');
    return;
  }
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: FROM, to: adminEmail,
    subject: `📬 New Contact: ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0a925d,#2563eb);padding:20px;text-align:center;">
          <h2 style="color:white;margin:0;">📬 New Contact Message</h2>
        </div>
        <div style="padding:20px;background:#f8fafc;">
          <table style="width:100%;">
            <tr><td style="padding:6px 0;color:#64748b;width:80px;">From</td><td style="font-weight:600;">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Email</td><td><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:6px 0;color:#64748b;">Phone</td><td><a href="tel:+91${phone}" style="color:#0a925d;">+91 ${phone}</a></td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#64748b;">Subject</td><td style="font-weight:600;">${subject}</td></tr>
          </table>
          <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:12px;">
            <p style="color:#334155;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="padding:16px;background:white;border-top:1px solid #e2e8f0;">
          <a href="mailto:${email}?subject=Re: ${subject}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">✉️ Reply</a>
          ${phone ? `<a href="https://wa.me/91${phone}" style="display:inline-block;background:#25d366;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;margin-left:8px;">💬 WhatsApp</a>` : ''}
          <a href="${process.env.CLIENT_URL}/admin/messages" style="display:inline-block;background:#0a925d;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;margin-left:8px;">Admin Panel</a>
        </div>
      </div>`,
  });

  // Auto-reply to sender
  await resend.emails.send({
    from: FROM, to: email,
    subject: `We received your message — Loknath Solution`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0a925d,#2563eb);padding:20px;text-align:center;">
          <h2 style="color:white;margin:0;">Thank You, ${name}! 🙏</h2>
        </div>
        <div style="padding:24px;">
          <p style="color:#334155;">Hi <strong>${name}</strong>,<br><br>
          We received your message about "<strong>${subject}</strong>" and will get back to you within 24 hours.</p>
          <div style="background:#f8fafc;border-left:4px solid #0a925d;padding:12px 16px;border-radius:4px;margin:16px 0;">
            <p style="color:#334155;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="color:#334155;">📞 <a href="tel:+919876543210" style="color:#0a925d;">+91 98765 43210</a><br>
          💬 <a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '919876543210'}" style="color:#25d366;">WhatsApp Us</a></p>
        </div>
      </div>`,
  });
};

// ─── Service request notification ─────────────────────────────
const sendServiceRequestNotification = async ({ name, phone, serviceType, description }) => {
  const resend = getResend();
  if (!resend) return;
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return;

  const labels = {
    'tax-payment': '🧾 Tax Payment', 'money-transfer': '💸 Money Transfer',
    'government-schemes': '🏛️ Govt Schemes', 'aadhaar-services': '🪪 Aadhaar',
    'voter-id': '🗳️ Voter ID', 'ration-card': '🍚 Ration Card',
    'form-filling': '📝 Form Filling', 'other': '📋 Other',
  };
  const label = labels[serviceType] || serviceType;

  await resend.emails.send({
    from: FROM, to: adminEmail,
    subject: `🆕 New Service Request: ${label}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#2563eb,#0a925d);padding:20px;text-align:center;">
          <h2 style="color:white;margin:0;">🆕 New Service Request</h2>
        </div>
        <div style="padding:20px;background:#f8fafc;">
          <table style="width:100%;">
            <tr><td style="padding:6px 0;color:#64748b;width:80px;">Name</td><td style="font-weight:600;">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Phone</td><td><a href="tel:+91${phone}" style="color:#0a925d;font-weight:600;">+91 ${phone}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Service</td><td style="color:#2563eb;font-weight:600;">${label}</td></tr>
          </table>
          <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:12px;">
            <p style="color:#334155;margin:0;">${description}</p>
          </div>
        </div>
        <div style="padding:16px;background:white;border-top:1px solid #e2e8f0;">
          <a href="https://wa.me/91${phone}?text=${encodeURIComponent(`Hello ${name}! We received your ${label} request.`)}" style="display:inline-block;background:#25d366;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">💬 WhatsApp Customer</a>
          <a href="${process.env.CLIENT_URL}/admin/service-requests" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;margin-left:8px;">Admin Panel</a>
        </div>
      </div>`,
  });
};

module.exports = { sendOTPEmail, sendContactNotification, sendServiceRequestNotification };