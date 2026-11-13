// Contact — real backend (/api/contact) se message jata hai, pehle jaisa.
import { useRef, useState } from 'react';
import { gsap } from '../utils/gsapSetup';
import { sendContactMessage } from '../utils/api';
import { profile } from '../data/portfolioData';

const empty = { name: '', email: '', phone: '', subject: '', message: '', hp_token: '' };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [bad, setBad] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const ref = useRef(null);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const b = {};
    ['name', 'email', 'subject', 'message'].forEach((k) => { if (!form[k].trim()) b[k] = true; });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) b.email = true;
    setBad(b);
    if (Object.keys(b).length) {
      Object.keys(b).forEach((k) => gsap.fromTo(ref.current.elements[k], { x: -6 }, { x: 0, duration: 0.6, ease: 'wig' }));
      return setStatus({ state: 'error', message: 'Please complete every field with a valid email.' });
    }
    setStatus({ state: 'loading', message: 'Sending…' });
    try {
      await sendContactMessage(form);
      setStatus({ state: 'success', message: "Message sent! I'll get back to you soon." });
      setForm(empty);
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Something went wrong. Please try again.' });
    }
  };

  return (
    <section id="contact" className="sec contact">
      <div>
        <p className="eyebrow" data-scramble>Checkout</p>
        <h2>Let's build something.</h2>
        <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
        <p><a href="https://wa.me/923273911082" target="_blank" rel="noreferrer">WhatsApp</a> · <a href="tel:+923273911082">{profile.phone}</a></p>
        <p><a href="https://www.linkedin.com/in/hasnain-zaidi-93727a35a" target="_blank" rel="noreferrer">LinkedIn</a> · <a href="https://github.com/Hasnain-zaidi156" target="_blank" rel="noreferrer">GitHub</a></p>
        <p>{profile.address}</p>
      </div>
      <form ref={ref} onSubmit={submit} noValidate>
        <label>Name<input name="name" className={bad.name ? 'err' : ''} value={form.name} onChange={set} autoComplete="name" /></label>
        <label>Email<input name="email" type="email" className={bad.email ? 'err' : ''} value={form.email} onChange={set} autoComplete="email" /></label>
        <label>Phone (optional)<input name="phone" value={form.phone} onChange={set} autoComplete="tel" /></label>
        <label>Subject<input name="subject" className={bad.subject ? 'err' : ''} value={form.subject} onChange={set} /></label>
        <label>Message<textarea name="message" rows="5" className={bad.message ? 'err' : ''} value={form.message} onChange={set} /></label>
        <input name="hp_token" value={form.hp_token} onChange={set} tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp" />
        <button className="btn dark mag" type="submit" disabled={status.state === 'loading'}>{status.state === 'loading' ? 'Sending…' : 'Send Message'}</button>
        <p id="msg" role="status" className={status.state}>{status.message}</p>
      </form>
    </section>
  );
}
