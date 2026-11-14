// Contact — form hata diya gaya; seedha WhatsApp / Call / Email / LinkedIn / GitHub.
import { profile } from '../data/portfolioData';

const WHATSAPP = { show: '0327 3911082', link: 'https://wa.me/923273911082' };
const CALL = { show: '0310 2094550', link: 'tel:+923102094550' };
const EMAIL = 'drhasnain953@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/hasnain-zaidi-93727a35a';
const GITHUB = 'https://github.com/Hasnain-zaidi156';

const CARDS = [
  { label: 'WhatsApp', value: WHATSAPP.show, href: WHATSAPP.link, ext: true },
  { label: 'Call', value: CALL.show, href: CALL.link },
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'LinkedIn', value: 'hasnain-zaidi-93727a35a', href: LINKEDIN, ext: true },
  { label: 'GitHub', value: 'Hasnain-zaidi156', href: GITHUB, ext: true },
];

export default function Contact() {
  return (
    <section id="contact" className="sec contact">
      <div>
        <p className="eyebrow" data-scramble>Contact</p>
        <h2>Let's build something.</h2>
        <p>Project ya collaboration ke liye seedha rabta karein — WhatsApp par sab se jaldi jawab milta hai.</p>
        <p className="muted">{profile.address}</p>
      </div>
      <div className="contact-cards">
        {CARDS.map((c) => (
          <a key={c.label} className="cc mag" href={c.href} {...(c.ext ? { target: '_blank', rel: 'noreferrer' } : {})}>
            <span className="cc-label">{c.label}</span>
            <span className="cc-value">{c.value}</span>
            <span className="cc-go" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
