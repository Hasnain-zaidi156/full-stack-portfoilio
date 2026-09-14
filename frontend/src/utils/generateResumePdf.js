import { jsPDF } from 'jspdf';
import { profile, skills, hobbies, experience, education, projects, achievements } from '../data/portfolioData';

// The 4 actual certificates (rest of the achievements array is just
// group/memory photos, not certificates) — these go on the resume's
// last page when the PDF is downloaded.
const resumeCertificates = achievements.slice(0, 4);

// Loads an image and renders it pre-clipped into a true CIRCLE with a
// transparent background (like CSS border-radius: 50% + object-fit: cover),
// returning a PNG data URL. Resolves null on failure.
const loadImageAsCircularDataURL = (url, sizePx = 320) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = sizePx;
                canvas.height = sizePx;
                const ctx = canvas.getContext('2d');

                ctx.save();
                ctx.beginPath();
                ctx.arc(sizePx / 2, sizePx / 2, sizePx / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();

                const scale = Math.max(sizePx / img.width, sizePx / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                ctx.drawImage(img, (sizePx - w) / 2, (sizePx - h) / 2, w, h);
                ctx.restore();

                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
        img.src = url;
        setTimeout(() => resolve(null), 5000);
    });
};

// Loads an image and returns it as a PNG data URL, letterboxed (object-fit:
// contain) inside a boxW x boxH white canvas, along with the natural aspect
// ratio info. Used for the certificate images on the resume's last page.
// Resolves null on failure so a broken image never breaks the whole PDF.
const loadImageAsBoxedDataURL = (url, boxW = 800, boxH = 600) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = boxW;
                canvas.height = boxH;
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, boxW, boxH);

                const scale = Math.min(boxW / img.width, boxH / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                ctx.drawImage(img, (boxW - w) / 2, (boxH - h) / 2, w, h);

                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
        img.src = url;
        setTimeout(() => resolve(null), 5000);
    });
};

const buildPdf = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const sidebarW = 65;

    pdf.setFillColor(30, 42, 58);
    pdf.rect(0, 0, sidebarW, pageH, 'F');

    const sx = 10;
    const sw = sidebarW - 20;
    let y = 18;

    const photoR = 16;
    const cx = sidebarW / 2;
    const cy = y + photoR;

    let photoLoaded = false;
    const imgData = await loadImageAsCircularDataURL(profile.photo);
    if (imgData) {
        try {
            pdf.addImage(imgData, 'PNG', cx - photoR, cy - photoR, photoR * 2, photoR * 2);
            photoLoaded = true;
        } catch (e) {
            photoLoaded = false;
        }
    }

    if (!photoLoaded) {
        const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase();
        pdf.setFillColor(44, 59, 82);
        pdf.circle(cx, cy, photoR, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text(initials, cx, cy + 2, { align: 'center' });
    }
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.6);
    pdf.circle(cx, cy, photoR, 'S');

    y = cy + photoR + 16;

    const sidebarHeading = (title) => {
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10.5);
        pdf.text(title.toUpperCase(), sx, y);
        pdf.setDrawColor(59, 74, 94);
        pdf.setLineWidth(0.3);
        pdf.line(sx, y + 1.8, sx + sw, y + 1.8);
        y += 9;
    };

    const sidebarText = (label, value) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text(label, sx, y);
        y += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(203, 213, 225);
        pdf.splitTextToSize(value, sw).forEach((line) => {
            pdf.text(line, sx, y);
            y += 4.8;
        });
        y += 5;
    };

    const sidebarBullets = (items, { link } = {}) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        items.forEach((item) => {
            const label = typeof item === 'string' ? item : item.name;
            const lines = pdf.splitTextToSize(label, sw - 5);
            lines.forEach((line, i) => {
                pdf.setTextColor(56, 189, 248);
                if (i === 0) pdf.text('•', sx, y);
                if (link && typeof item === 'object' && item.link) {
                    pdf.setTextColor(125, 211, 252);
                    pdf.textWithLink(line, sx + 4, y, { url: item.link });
                } else {
                    pdf.setTextColor(203, 213, 225);
                    pdf.text(line, sx + 4, y);
                }
                y += 5.2;
            });
            y += 1.5;
        });
        y += 6;
    };

    sidebarHeading('Contact');
    sidebarText('Address', profile.address);
    sidebarText('Phone', profile.phone);
    sidebarText('Email', profile.email);

    sidebarHeading('Skills');
    sidebarBullets(skills);

    sidebarHeading('Projects');
    const projectLinks = projects.map((p) => ({ name: p.title, link: p.demo }));
    sidebarBullets(projectLinks, { link: true });

    sidebarHeading('Hobbies');
    sidebarBullets(hobbies);

    // ---------- Main content ----------
    const mx = sidebarW + 12;
    const mw = pageW - sidebarW - 24;
    let my = 24;

    pdf.setTextColor(30, 41, 59);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text(profile.name.toUpperCase(), mx, my);
    my += 9;

    pdf.setTextColor(71, 85, 105);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.text(profile.role, mx, my);
    my += 16;

    const mainHeading = (title) => {
        pdf.setTextColor(30, 41, 59);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(title, mx, my);
        pdf.setDrawColor(30, 42, 58);
        pdf.setLineWidth(0.6);
        pdf.line(mx, my + 2, mx + mw, my + 2);
        my += 11;
    };

    const mainParagraph = (text, size = 9) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(size);
        pdf.setTextColor(51, 65, 85);
        pdf.splitTextToSize(text, mw).forEach((line) => {
            if (my > pageH - 15) {
                pdf.addPage();
                my = 20;
            }
            pdf.text(line, mx, my);
            my += 5.6;
        });
    };

    mainHeading('Profile');
    mainParagraph(profile.summary);
    my += 14;

    mainHeading('Experience');
    experience.forEach((job) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9.5);
        pdf.setTextColor(30, 41, 59);
        pdf.text(job.title, mx, my);
        my += 5.5;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(job.date, mx, my);
        my += 7;
        job.points.forEach((pt) => mainParagraph('• ' + pt));
        my += 6;
    });
    my += 8;

    mainHeading('Education');
    education.forEach((ed) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9.5);
        pdf.setTextColor(30, 41, 59);
        pdf.text(ed.title, mx, my);
        my += 5.5;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(ed.place, mx, my);
        my += 9;
    });

    // ---------- Certificates page ----------
    if (resumeCertificates.length > 0) {
        pdf.addPage();

        pdf.setTextColor(30, 41, 59);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('Certificates', 14, 20);
        pdf.setDrawColor(30, 42, 58);
        pdf.setLineWidth(0.6);
        pdf.line(14, 23, pageW - 14, 23);

        const margin = 14;
        const gap = 8;
        const cols = 2;
        const cellW = (pageW - margin * 2 - gap * (cols - 1)) / cols;
        const imgH = cellW * 0.7;
        const cellH = imgH + 14;
        let cx0 = margin;
        let cy0 = 32;

        for (let i = 0; i < resumeCertificates.length; i++) {
            const cert = resumeCertificates[i];
            const col = i % cols;
            const row = Math.floor(i / cols);
            const boxX = margin + col * (cellW + gap);
            const boxY = cy0 + row * (cellH + gap);

            if (boxY + cellH > pageH - 12) {
                pdf.addPage();
                cy0 = 20;
            }
            const finalBoxY = (boxY + cellH > pageH - 12) ? cy0 : boxY;

            pdf.setDrawColor(226, 232, 240);
            pdf.setLineWidth(0.3);
            pdf.rect(boxX, finalBoxY, cellW, imgH);

            const certImg = await loadImageAsBoxedDataURL(cert.img, 800, 560);
            if (certImg) {
                try {
                    pdf.addImage(certImg, 'PNG', boxX, finalBoxY, cellW, imgH);
                } catch (e) {
                    // skip broken image, box outline still shows
                }
            }

            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(8.5);
            pdf.setTextColor(30, 41, 59);
            pdf.text(cert.title, boxX, finalBoxY + imgH + 5);
        }
    }

    return pdf;
};

// Public function: builds the PDF and triggers a direct download.
// Call this from ANY component (Home button, Resume page button, etc.)
// Returns true on success, false on failure (and shows an alert).
export const downloadResumePdf = async () => {
    try {
        const pdf = await buildPdf();
        const fileName = `${profile.name.replace(/\s+/g, '-')}-Resume.pdf`;

        const blob = pdf.output('blob');
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 3000);
        return true;
    } catch (err) {
        console.error('PDF download failed:', err);
        alert('Resume download nahi ho saka. Internet connection check karein aur dobara try karein.');
        return false;
    }
};