import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Home.css';
import { downloadResumePdf } from '../utils/generateResumePdf';
import { IconAtom, IconSparkle } from '../components/Icons';

export default function Home() {
    const [downloading, setDownloading] = useState(false);

    const handleResumeDownload = async () => {
        setDownloading(true);
        await downloadResumePdf();
        setDownloading(false);
    };

    return (
        <>
            <section className="hero">
                <div className="hero-inner">
                    {/* Left side */}
                    <div>
                        <div className="hero-badge">
                            <span className="badge-dot"></span> Available for Work
                        </div>
                        <h1 className="hero-title">
                            <span className="nm">Hasnain</span>
                            <span className="ac">Zaidi</span>
                        </h1>
                        <p className="hero-role">Full Stack Developer</p>
                        <p className="hero-desc">
                            Crafting clean, responsive web experiences with the MERN stack —
                            React, Node.js, Express &amp; MongoDB. Based in Rohri, Sindh — passionate about bringing designs to life.
                        </p>
                        <div className="hero-btns">
                            <Link to="/projects" className="btn-p">View Projects</Link>
                            <Link to="/contact" className="btn-o">Get In Touch</Link>
                            <button
                                type="button"
                                className="btn-o"
                                onClick={handleResumeDownload}
                                disabled={downloading}
                            >
                                {downloading ? 'Preparing PDF...' : 'Download Resume'}
                            </button>
                        </div>
                        <div className="socials">
                            <a href="https://www.linkedin.com/in/hasnain-zaidi-93727a35a" target="_blank" rel="noreferrer" className="soc">
                                <img src="https://cdn-icons-png.flaticon.com/128/3992/3992606.png" alt="LinkedIn" />
                            </a>
                            <a href="https://github.com/Hasnain-zaidi156" target="_blank" rel="noreferrer" className="soc">
                                <img src="https://cdn-icons-png.flaticon.com/128/733/733553.png" alt="GitHub" />
                            </a>
                            <a href="mailto:drhasnain953@gmail.com" className="soc">
                                <img src="https://cdn-icons-png.flaticon.com/128/15047/15047587.png" alt="Email" />
                            </a>
                            <a href="https://wa.me/923273911082" target="_blank" rel="noreferrer" className="soc">
                                <img src="https://cdn-icons-png.flaticon.com/128/4423/4423697.png" alt="WhatsApp" />
                            </a>
                        </div>
                        <div className="stats">
                            <div>
                                <div className="stat-num">7+</div>
                                <div className="stat-lbl">Projects Done</div>
                            </div>
                            <div>
                                <div className="stat-num">90%</div>
                                <div className="stat-lbl">HTML5 Skill</div>
                            </div>
                            <div>
                                <div className="stat-num"><IconAtom /></div>
                                <div className="stat-lbl">React.js</div>
                            </div>
                        </div>
                    </div>

                    {/* Right side — orbit visual */}
                    <div className="hero-visual">
                        <div className="orbit-wrap">
                            <div className="orbit-ring"></div>
                            <div className="orbit-ring2"></div>
                            <div className="profile-img">
                                <img
                                    src="https://i.ibb.co/0p0H1SYJ/new-pic.jpg"
                                    alt="Hasnain Zaidi"
                                    onError={(e) => (e.target.style.display = 'none')}
                                />
                            </div>
                            <div className="chip chip-react"><IconAtom /> React.js</div>
                            <div className="chip chip-html">&lt;/&gt; HTML5</div>
                            <div className="chip chip-css"><IconSparkle /> CSS3</div>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <p>Designed &amp; Built by <span>Hasnain Zaidi</span> — Full Stack Developer</p>
            </footer>
        </>
    );
}