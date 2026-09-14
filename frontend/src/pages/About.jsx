import React from 'react';
import '../style/About.css';

export default function About() {
  return (
    <>
      <main className="page-wrap">
        <div className="page-label">Get to know me</div>
        <h1 className="page-title">About <span>Me</span></h1>

        <div className="about-grid">
          {/* Photo side */}
          <div className="photo-wrap">
            <div className="photo-card">
              <img
                src="https://i.ibb.co/0p0H1SYJ/new-pic.jpg"
                alt="Hasnain Zaidi"
                onError={(e) => {
                  e.target.style.display = 'none';
                  document.querySelector('.photo-no').style.display = 'flex';
                }}
              />
              <div className="photo-no" style={{ display: 'none' }}>HZ</div>
            </div>
            <div className="photo-badge">
              <small>Currently</small>Learning &amp; Building
            </div>
          </div>

          {/* Text side */}
          <div className="text-side">
            <h3>I'm Hasnain Zaidi</h3>
            <p>
              A passionate <strong>Full Stack Developer</strong> from Rohri,
              Sindh, Pakistan. Currently honing my skills at <strong>Saylani Mass IT Training</strong>,
              with a strong Computer Science foundation from Govt Islamia Science College Sukkur.
            </p>
            <p>
              I specialize in the MERN Stack — MongoDB, Express.js, React.js & Node.js — bringing
              modern, component-driven designs to life with clean code and attention to detail. My
              goal is to build web apps that are not only beautiful but also performant and
              accessible, on both the client and server side.
            </p>
            <p>
              When I'm not coding, I'm exploring new web technologies and keeping up with the
              latest in MERN stack development.
            </p>

            <div className="info-grid">
              <div className="info-card"><strong>Name</strong><span>Hasnain Zaidi</span></div>
              <div className="info-card"><strong>Email</strong><span>drhasnain953@gmail.com</span></div>
              <div className="info-card"><strong>Phone</strong><span>+92 327 3911082</span></div>
              <div className="info-card"><strong>Location</strong><span>Rohri, Sukkur, Sindh</span></div>
              <div className="info-card"><strong>Education</strong><span>Govt Islamia Science College Sukkur</span></div>
              <div className="info-card"><strong>Training</strong><span>Saylani Mass IT Training</span></div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>Designed &amp; Built by <span>Hasnain Zaidi</span> — Full Stack Developer</p>
      </footer>
    </>
  );
}