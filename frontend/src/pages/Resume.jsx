import React, { useState } from 'react';
import '../style/Resume.css';
import { profile, skills, hobbies, experience, education, projects } from '../data/portfolioData';
import { downloadResumePdf } from '../utils/generateResumePdf';
import { IconDownload } from '../components/Icons';

export default function Resume() {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        await downloadResumePdf();
        setDownloading(false);
    };

    return (
        <div className="resume-page">
            <button
                className="resume-download-btn"
                onClick={handleDownload}
                disabled={downloading}
            >
                {downloading ? 'Generating PDF...' : (<><IconDownload /> Download Resume (PDF)</>)}
            </button>

            <div className="resume-sheet">
                {/* Sidebar */}
                <aside className="resume-sidebar">
                    <div className="resume-photo">
                        <img src={profile.photo} alt={profile.name} />
                    </div>

                    <div className="resume-block">
                        <h3>Contact</h3>
                        <p><strong>Address</strong><br />{profile.address}</p>
                        <p><strong>Phone</strong><br />{profile.phone}</p>
                        <p><strong>Email</strong><br />{profile.email}</p>
                    </div>

                    <div className="resume-block">
                        <h3>Skills</h3>
                        <ul>
                            {skills.map((s) => (
                                <li key={s}>{s}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="resume-block">
                        <h3>Projects</h3>
                        <ul>
                            {projects.map((p, i) => (
                                <li key={i}>
                                    <a
                                        href={p.demo}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="resume-project-link"
                                    >
                                        {p.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="resume-block">
                        <h3>Hobbies</h3>
                        <ul>
                            {hobbies.map((h) => (
                                <li key={h}>{h}</li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main */}
                <main className="resume-main">
                    <h1>{profile.name.toUpperCase()}</h1>
                    <p className="resume-role">{profile.role}</p>

                    <section>
                        <h2>Profile</h2>
                        <p>{profile.summary}</p>
                    </section>

                    <section>
                        <h2>Experience</h2>
                        {experience.map((job, i) => (
                            <div className="resume-item" key={i}>
                                <h4>{job.title}</h4>
                                <span className="resume-date">{job.date}</span>
                                <ul>
                                    {job.points.map((pt, j) => (
                                        <li key={j}>{pt}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section>
                        <h2>Education</h2>
                        {education.map((ed, i) => (
                            <div className="resume-item" key={i}>
                                <h4>{ed.title}</h4>
                                <span className="resume-date">{ed.place}</span>
                            </div>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
}