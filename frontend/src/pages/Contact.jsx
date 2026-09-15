import React, { useState } from 'react';
import '../style/About.css';
import '../style/Contact.css';
import { IconMail } from '../components/Icons';
import { sendContactMessage } from '../utils/api';

const initialForm = { name: '', email: '', phone: '', subject: '', message: '', company: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      await sendContactMessage(form);
      setStatus({ state: 'success', message: "Message sent! I'll get back to you soon." });
      setForm(initialForm);
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Something went wrong. Please try again.' });
    }
  };

  return (
    <>
      <main className="page-wrap">
        <div className="page-label">Let's connect</div>
        <h1 className="page-title">Get In <span>Touch</span></h1>
        <p style={{ color: 'var(--muted)', marginBottom: '4rem' }}>
          I'm available for freelance work and collaborations
        </p>

        {/* CTA block */}
        <div className="cta-block">
          <h3>Let's Work Together</h3>
          <p>
            Have a project in mind or want to collaborate? Drop me an email and I'll get back to
            you as soon as possible.
          </p>
          <a href="mailto:drhasnain953@gmail.com" className="cta-email">
            <IconMail /> drhasnain953@gmail.com
          </a>
        </div>

        {/* Contact cards */}
        <div className="cards-grid">
          <div className="contact-card">
            <div className="c-icon">
              <img src="https://cdn-icons-png.flaticon.com/128/15047/15047587.png" alt="Email" />
            </div>
            <div className="c-info">
              <strong>Email</strong>
              <a href="mailto:drhasnain953@gmail.com">drhasnain953@gmail.com</a>
            </div>
          </div>

          <div className="contact-card">
            <div className="c-icon">
              <img src="https://cdn-icons-png.flaticon.com/128/9418/9418116.png" alt="Phone" />
            </div>
            <div className="c-info">
              <strong>Phone</strong>
              <span>+92 327 3911082</span>
              <div className="c-actions">
                <a href="https://wa.me/923273911082" target="_blank" rel="noreferrer" className="c-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/4423/4423697.png" alt="" /> WhatsApp
                </a>
                <a href="tel:+923273911082" className="c-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/16076/16076069.png" alt="" /> Call
                </a>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <div className="c-icon">
              <img src="https://cdn-icons-png.flaticon.com/128/684/684908.png" alt="Location" />
            </div>
            <div className="c-info">
              <strong>Location</strong>
              <span>Rohri, Sukkur, Sindh, Pakistan</span>
            </div>
          </div>

          <div className="contact-card">
            <div className="c-icon">
              <img src="https://cdn-icons-png.flaticon.com/128/3992/3992606.png" alt="LinkedIn" />
            </div>
            <div className="c-info">
              <strong>LinkedIn</strong>
              <a href="https://www.linkedin.com/in/hasnain-zaidi-93727a35a" target="_blank" rel="noreferrer">
                hasnain-zaidi-93727a35a
              </a>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="social-title">Send a Message</div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="phone">Phone Number <span className="optional-tag">(optional)</span></label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                minLength={7}
                maxLength={20}
                value={form.phone}
                onChange={handleChange}
                placeholder="+92 3XX XXXXXXX"
              />
            </div>
            <div className="form-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
              />
            </div>
          </div>

          {/* Honeypot field — hidden from real users, bots tend to fill it in */}
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="hp-field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={6}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
            />
          </div>

          <button type="submit" className="form-submit" disabled={status.state === 'loading'}>
            {status.state === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {status.state === 'success' && <p className="form-status success">{status.message}</p>}
          {status.state === 'error' && <p className="form-status error">{status.message}</p>}
        </form>

        {/* Socials */}
        <div className="social-title">Connect With Me</div>
        <div className="socials-row">
          <a href="https://www.linkedin.com/in/hasnain-zaidi-93727a35a" target="_blank" rel="noreferrer" className="soc-card">
            <img src="https://cdn-icons-png.flaticon.com/128/3992/3992606.png" alt="LinkedIn" />
            <div>
              <div className="soc-label">LinkedIn</div>
              <div className="soc-handle">hasnain-zaidi</div>
            </div>
          </a>
          <a href="https://github.com/Hasnain-zaidi156" target="_blank" rel="noreferrer" className="soc-card">
            <img src="https://cdn-icons-png.flaticon.com/128/733/733553.png" alt="GitHub" />
            <div>
              <div className="soc-label">GitHub</div>
              <div className="soc-handle">Hasnain-zaidi156</div>
            </div>
          </a>
          <a href="mailto:drhasnain953@gmail.com" className="soc-card">
            <img src="https://cdn-icons-png.flaticon.com/128/15047/15047587.png" alt="Email" />
            <div>
              <div className="soc-label">Email</div>
              <div className="soc-handle">drhasnain953@gmail.com</div>
            </div>
          </a>
          <a href="https://wa.me/923273911082" target="_blank" rel="noreferrer" className="soc-card">
            <img src="https://cdn-icons-png.flaticon.com/128/4423/4423697.png" alt="WhatsApp" />
            <div>
              <div className="soc-label">WhatsApp</div>
              <div className="soc-handle">+92 327 3911082</div>
            </div>
          </a>
        </div>
      </main>

      <footer>
        <p>Designed &amp; Built by <span>Hasnain Zaidi</span> — Full Stack Developer</p>
      </footer>
    </>
  );
}