// Sends email via Brevo's Transactional Email HTTP API (https://api.brevo.com).
// We use the HTTP API instead of SMTP because most free hosting tiers
// (Render, Railway, etc.) block outbound SMTP ports (25/465/587), but
// regular HTTPS traffic is never blocked.

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function getFromEmail() {
  return process.env.FROM_EMAIL || process.env.SENDER_EMAIL;
}

function getApiKey() {
  return process.env.BREVO_API_KEY;
}

async function sendViaBrevo({ to, replyTo, subject, text, html }) {
  const apiKey = getApiKey();
  const fromEmail = getFromEmail();

  if (!apiKey) throw new Error('BREVO_API_KEY is not set');
  if (!fromEmail) throw new Error('FROM_EMAIL is not set');

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: 'Portfolio' },
      to: [{ email: to }],
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Brevo API error (${res.status}): ${body}`);
  }

  return res.json();
}

export async function verifyMailer() {
  if (!getApiKey()) {
    console.error('Mailer verification failed: BREVO_API_KEY is not set');
    return;
  }
  if (!getFromEmail()) {
    console.error('Mailer verification failed: FROM_EMAIL is not set');
    return;
  }
  console.log('Mailer ready ✅ (Brevo HTTP API)');
}

export async function sendOwnerNotification({ name, email, phone, subject, message }) {
  const to = process.env.OWNER_EMAIL || getFromEmail();

  return sendViaBrevo({
    to,
    replyTo: email,
    subject: `New portfolio message: ${subject || 'No subject'}`,
    text: `From: ${name} <${email}>${phone ? `\nPhone: ${phone}` : ''}\n\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#1a1a1a;">
        <h2 style="margin:0 0 12px;">New message from your portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subject || '-'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap; background:#f5f5f5; padding:12px; border-radius:8px;">${message}</p>
      </div>
    `,
  });
}

export async function sendAutoReply({ name, email }) {
  return sendViaBrevo({
    to: email,
    subject: 'Aapka paigham mil gaya hai — Shukriya!',
    text: `Assalam-o-Alaikum ${name},\n\nAapka paigham mujhe mil gaya hai, shukriya rabta karne ke liye. Main jald hi aap se rabta karunga/karungi.\n\nJazakAllah,\nHasnain`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.8; color:#1a1a1a;">
        <p>Assalam-o-Alaikum ${name},</p>
        <p>Aapka paigham mujhe mil gaya hai, shukriya rabta karne ke liye. Main jald hi aap se rabta karunga/karungi.</p>
        <p>JazakAllah,<br/>Hasnain</p>
      </div>
    `,
  });
}
