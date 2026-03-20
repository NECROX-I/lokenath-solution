const { Resend } = require('resend');

const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

// ─── Notify admin when contact form is submitted ───────────────
const sendContactNotification = async ({ name, email, phone, subject, message }) => {
  const resend = getResend();
  if (!resend) {
    console.log('⚠️  RESEND_API_KEY not set — skipping email notification');
    return;
  }

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) {
    console.log('⚠️  ADMIN_NOTIFY_EMAIL not set — skipping notification');
    return;
  }

  // Email to admin
  await resend.emails.send({
    from: 'Loknath Solution <onboarding@resend.dev>',
    to: adminEmail,
    subject: `📬 New Contact Message: ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0a925d,#2563eb);padding:24px;text-align:center;">
          <h2 style="color:white;margin:0;font-size:20px;">📬 New Contact Message</h2>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">Loknath Solution Website</p>
        </div>
        <div style="padding:24px;background:#f8fafc;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:100px;">From</td><td style="padding:8px 0;color:#0f172a;font-weight:600;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#2563eb;font-size:14px;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Phone</td><td style="padding:8px 0;"><a href="tel:+91${phone}" style="color:#0a925d;font-size:14px;font-weight:600;">+91 ${phone}</a></td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Subject</td><td style="padding:8px 0;color:#0f172a;font-weight:600;font-size:14px;">${subject}</td></tr>
          </table>
          <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:8px;">
            <p style="color:#64748b;font-size:12px;margin:0 0 6px;">Message:</p>
            <p style="color:#334155;font-size:14px;margin:0;line-height:1.6;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="padding:16px 24px;background:white;border-top:1px solid #e2e8f0;">
          <a href="mailto:${email}?subject=Re: ${subject}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">✉️ Reply via Email</a>
          ${phone ? `<a href="https://wa.me/91${phone}?text=Hello ${encodeURIComponent(name)}! Thank you for contacting Loknath Solution." style="display:inline-block;background:#25d366;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;margin-left:8px;">💬 WhatsApp</a>` : ''}
          <a href="${process.env.CLIENT_URL}/admin/messages" style="display:inline-block;background:#0a925d;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;margin-left:8px;">🔐 Admin Panel</a>
        </div>
        <div style="padding:12px 24px;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">Received at ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
        </div>
      </div>
    `,
  });

  // Auto-reply to sender
  await resend.emails.send({
    from: 'Loknath Solution <onboarding@resend.dev>',
    to: email,
    subject: `We received your message — Loknath Solution`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0a925d,#2563eb);padding:24px;text-align:center;">
          <h2 style="color:white;margin:0;">Thank You, ${name}! 🙏</h2>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">We've received your message</p>
        </div>
        <div style="padding:24px;">
          <p style="color:#334155;font-size:14px;line-height:1.7;">
            Hi <strong>${name}</strong>,<br/><br/>
            Thank you for contacting <strong>Loknath Solution</strong>. We've received your message about
            "<strong>${subject}</strong>" and will get back to you within <strong>24 hours</strong>.
          </p>
          <div style="background:#f8fafc;border-left:4px solid #0a925d;padding:12px 16px;border-radius:4px;margin:16px 0;">
            <p style="color:#64748b;font-size:13px;margin:0;">Your message:</p>
            <p style="color:#334155;font-size:13px;margin:6px 0 0;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="color:#334155;font-size:14px;">
            For urgent queries:<br/>
            📞 <a href="tel:+919876543210" style="color:#0a925d;">+91 98765 43210</a><br/>
            💬 <a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '919876543210'}" style="color:#25d366;">Chat on WhatsApp</a>
          </p>
        </div>
        <div style="padding:16px 24px;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} Loknath Solution · Your Trusted Neighbourhood Shop</p>
        </div>
      </div>
    `,
  });
};

// ─── Notify admin when service request is submitted ────────────
const sendServiceRequestNotification = async ({ name, phone, serviceType, description }) => {
  const resend = getResend();
  if (!resend) return;

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return;

  const serviceLabels = {
    'tax-payment': '🧾 Tax Payment', 'money-transfer': '💸 Money Transfer',
    'government-schemes': '🏛️ Govt Schemes', 'aadhaar-services': '🪪 Aadhaar Services',
    'voter-id': '🗳️ Voter ID', 'ration-card': '🍚 Ration Card',
    'form-filling': '📝 Form Filling', 'other': '📋 Other',
  };

  await resend.emails.send({
    from: 'Loknath Solution <onboarding@resend.dev>',
    to: adminEmail,
    subject: `🆕 New Service Request: ${serviceLabels[serviceType] || serviceType}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#2563eb,#0a925d);padding:24px;text-align:center;">
          <h2 style="color:white;margin:0;">🆕 New Service Request</h2>
        </div>
        <div style="padding:24px;background:#f8fafc;">
          <table style="width:100%;">
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;font-size:14px;color:#0f172a;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Phone</td><td style="padding:8px 0;"><a href="tel:+91${phone}" style="color:#0a925d;font-size:14px;font-weight:600;">+91 ${phone}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Service</td><td style="padding:8px 0;font-size:14px;color:#2563eb;font-weight:600;">${serviceLabels[serviceType] || serviceType}</td></tr>
          </table>
          <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:12px;">
            <p style="color:#64748b;font-size:12px;margin:0 0 6px;">Description:</p>
            <p style="color:#334155;font-size:14px;margin:0;line-height:1.6;">${description}</p>
          </div>
        </div>
        <div style="padding:16px 24px;background:white;border-top:1px solid #e2e8f0;">
          <a href="https://wa.me/91${phone}?text=Hello%20${encodeURIComponent(name)}!%20We%20received%20your%20request%20for%20${encodeURIComponent(serviceLabels[serviceType])}." style="display:inline-block;background:#25d366;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">💬 WhatsApp Customer</a>
          <a href="${process.env.CLIENT_URL}/admin/service-requests" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;margin-left:8px;">View in Admin Panel</a>
        </div>
      </div>
    `,
  });
};

module.exports = { sendContactNotification, sendServiceRequestNotification, sendOTPEmail };


// ─── Send OTP to customer for login / registration ─────────────
async function sendOTPEmail({ email, otp, isNew }) {
  const resend = getResend();

  if (!resend) {
    // Dev fallback — print to console so you can still test locally
    console.log(`\n📧 OTP EMAIL (Resend not configured)`);
    console.log(`   To: ${email}`);
    console.log(`   OTP: ${otp}`);
    console.log(`   Expires in 10 minutes\n`);
    return;
  }

  await resend.emails.send({
    from: 'Loknath Solution <onboarding@resend.dev>',
    to: email,
    subject: `${otp} — Your Login OTP for Loknath Solution`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">

        <div style="background:linear-gradient(135deg,#0a925d,#2563eb);padding:28px;text-align:center;">
          <h2 style="color:white;margin:0;font-size:22px;">🔐 Your Login Code</h2>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Loknath Solution</p>
        </div>

        <div style="padding:32px;text-align:center;">
          <p style="color:#334155;font-size:15px;margin:0 0 24px;">
            ${isNew ? 'Welcome! Use this code to create your account.' : 'Use this code to sign in to your account.'}
          </p>

          <!-- OTP Block -->
          <div style="background:#f8fafc;border:2px dashed #0a925d;border-radius:12px;padding:24px;margin:0 auto 24px;display:inline-block;min-width:200px;">
            <p style="color:#64748b;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your OTP</p>
            <p style="color:#0a925d;font-size:42px;font-weight:900;letter-spacing:12px;margin:0;font-family:'Courier New',monospace;">${otp}</p>
          </div>

          <div style="background:#fefce8;border:1px solid #fde047;border-radius:10px;padding:14px;margin-bottom:24px;text-align:left;">
            <p style="color:#854d0e;font-size:13px;margin:0;">
              ⏰ <strong>Expires in 10 minutes</strong><br/>
              🔒 Never share this code with anyone — including shop staff.<br/>
              ❌ If you didn't request this, ignore this email safely.
            </p>
          </div>

          <p style="color:#94a3b8;font-size:12px;margin:0;">
            © ${new Date().getFullYear()} Loknath Solution · Your Trusted Neighbourhood Shop
          </p>
        </div>
      </div>
    `,
  });
}