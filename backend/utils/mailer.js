import nodemailer from 'nodemailer';

// Builds a Nodemailer transporter using either:
//  - Gmail + App Password (EMAIL_SERVICE=gmail, EMAIL_USER, EMAIL_PASS)
//  - Custom SMTP (SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS)
function createTransporter() {
  if (process.env.EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g. "gmail"
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const transporter = createTransporter();

export async function verifyMailer() {
  try {
    await transporter.verify();
    console.log('Mailer ready ✅');
  } catch (err) {
    console.error('Mailer verification failed:', err.message);
  }
}

const fromAddress = () => process.env.EMAIL_USER || process.env.SMTP_USER;

export async function sendOwnerNotification({ name, email, phone, subject, message }) {
  const to = process.env.OWNER_EMAIL || fromAddress();

  return transporter.sendMail({
    from: `"Portfolio Contact" <${fromAddress()}>`,
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
  return transporter.sendMail({
    from: `"Portfolio" <${fromAddress()}>`,
    to: email,
    subject: 'Thanks for reaching out!',
    text: `Hi ${name},\n\nThanks for your message — I've received it and will get back to you soon.\n\nBest,\nHasnain`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#1a1a1a;">
        <p>Hi ${name},</p>
        <p>Thanks for reaching out! I've received your message and will get back to you as soon as possible.</p>
        <p>Best,<br/>Hasnain</p>
      </div>
    `,
  });
}
