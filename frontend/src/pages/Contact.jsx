import '../style/About.css';
import '../style/Contact.css';
import { IconMail } from '../components/Icons';

export default function Contact() {
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
            Have a project in mind or want to collaborate? Drop me an email, WhatsApp or call and I'll get back to
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
              <span>WhatsApp: 0327 3911082 · Call: 0310 2094550</span>
              <div className="c-actions">
                <a href="https://wa.me/923273911082" target="_blank" rel="noreferrer" className="c-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/4423/4423697.png" alt="" /> WhatsApp
                </a>
                <a href="tel:+923102094550" className="c-btn">
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
              <div className="soc-handle">0327 3911082</div>
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