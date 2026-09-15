// ============================================================
// SINGLE SOURCE OF TRUTH for portfolio data.
// Edit values HERE ONLY — Projects page AND Resume page (both
// the web view and the downloaded PDF) read from this file,
// so they always stay in sync automatically.
// ============================================================

export const profile = {
    name: 'Hasnain Zaidi',
    role: 'Full Stack Developer',
    address: 'Rohri, Sindh, Pakistan',
    phone: '+92 327 3911082',
    email: 'drhasnain953@gmail.com',
    // IMPORTANT: put your photo file at public/profile.jpg in your project.
    // A local file avoids CORS issues that break PDF generation with
    // externally-hosted images (like i.ibb.co).
    photo: '/profile.jpg',
    summary: 'MERN Stack developer specializing in React.js, Node.js, Express & MongoDB, ' +
        'currently training at SMIT (Saylani Mass IT Training). Experienced in building ' +
        'production-ready web apps for real clients, from admin portals to e-commerce and ' +
        'business management systems. Background in Computer Science with a strong eye for ' +
        'clean, responsive UI.',
};

export const skills = [
    'React.js',
    'Node.js & Express.js',
    'MongoDB',
    'JavaScript (ES6+)',
    'HTML5 & CSS3',
    'Bootstrap 5',
    'Git & GitHub',
    'REST APIs',
];

export const hobbies = ['Coding', 'Learning New Tech', 'Client Projects'];

// Achievements & Memories gallery — shown on the Achievements page.
export const achievements = [{
        title: 'TITAN Certificate',
        desc: 'Official certification recognizing skills and accomplishment.',
        img: 'https://i.ibb.co/Mv3BvZW/1-copy.jpg',
        isCertificate: true,
    },
    {
        title: 'Hackathon Certificate',
        desc: 'On 27 December 2025 in TITAN SAylani Sukkur our JavaScript test is duration 8 Hours.',
        img: 'https://i.ibb.co/qYhGSXZ5/2.jpg',
    },
    {
        title: 'Mini Certificate',
        desc: 'This is my HTML, CSS & BOOTSTRAP test certificate.',
        img: 'https://i.ibb.co/rX0Yn8b/6.jpg',
    },
    {
        title: 'Internship Certificate',
        desc: 'This is my 2 months duration internship certificate. NOVASTACK HUB company',
        img: 'https://i.ibb.co/2714JNJn/certificate-NSH-2026-3-HXD8-J.png',
    },
    {
        title: 'Memory',
        desc: 'My last pic on 17 August 2026 with Sir Syed Sammar Abbas with Final Certificate.',
        img: 'https://i.ibb.co/fd4DJm1M/3.jpg',
    },
    {
        title: 'Memory',
        desc: 'My last pic on 17 August 2026 with Sir Yasir Ali Lashari with FInal Certificate.',
        img: 'https://i.ibb.co/PzQdVM92/a9fbaf2f-e0c4-49be-b937-91582ac1221f.jpg',
    },
    {
        title: 'Memory',
        desc: 'Our last group picture Batch-1 with friends with certificate.',
        img: 'https://i.ibb.co/VpN59jys/4.jpg',
    },
    {
        title: 'Memory',
        desc: 'Our last pic in RT GRACE SUK on 5 August 2026 with friends and SIR YASIR LASHARI. Excellent Memory.',
        img: 'https://i.ibb.co/SGjmX4W/7.jpg',
    },
    {
        title: 'Memory',
        desc: 'Our last pic in RT GRACE SUK on 5 August 2026 with friends and SIR YASIR LASHARI. Excellent Memory.',
        img: 'https://i.ibb.co/bMRK4mgG/8.jpg',
    },
    {
        title: 'Memory',
        desc: 'Our last pic in RT GRACE SUK on 5 August 2026 with friends and SIR YASIR LASHARI. Excellent Memory.',
        img: 'https://i.ibb.co/1ffRs1mk/9.jpg',
    },
];

export const experience = [{
    title: 'MERN Stack Developer (Freelance / Client Projects)',
    date: '2023 — Present',
    points: [
        'Built full admin/trainer/student portal (TITAN) with role-based access.',
        'Delivered order management system for a homeopathic clinic business.',
        'Developed multiple client websites with cart, WhatsApp ordering, and PDF generation features.',
    ],
}, ];

export const education = [{
    title: 'Computer Science',
    place: 'Govt. Islamia Science College, Sukkur',
}, ];

// Add / edit / remove a project HERE and it will automatically
// show up on both the Projects page and the Resume (web + PDF).
export const projects = [{
        title: 'Online Universal Mart',
        desc: 'A modern, fully responsive e-commerce platform with smooth animations and intuitive UI. Features product listings, shopping cart, and checkout process.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/b57hCSrx/logo.jpg',
        placeholder: 'cart',
        demo: 'https://online-universal-mart.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Simple Resume Maker',
        desc: 'A clean resume builder with smooth user experience. Built with modern web technologies and best practices for structured resume output.',
        tags: ['HTML5', 'CSS3', 'Responsive', 'Animation'],
        img: 'https://i.ibb.co/LzCb1HpH/resume-maker-web.png',
        placeholder: 'document',
        demo: 'https://resumemaker-hasnain.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Mehfil e Zaiqa',
        desc: 'Modern restaurant website with menu display, online ordering system, and reservation functionality. Mobile-friendly and easy to navigate.',
        tags: ['HTML5', 'CSS3', 'JavaScript'],
        img: 'https://i.ibb.co/Y7SnPhS9/logo.png',
        placeholder: 'food',
        demo: 'https://mehfilezaiqa.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Flip the Coin',
        desc: 'A responsive and user-friendly crypto website designed to present a modern digital coin concept with clean animations and smooth UX.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: null,
        placeholder: 'coin',
        demo: 'https://toosthecoin.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Calculator',
        desc: 'A modern calculator with clean, user-friendly interface. Supports all basic arithmetic operations with clearly visible buttons and smooth display.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: null,
        placeholder: 'calculator',
        demo: 'https://mycalculator-hasnain.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Sum Checker',
        desc: 'A simple yet effective sum checker application that allows users to input two numbers and verify their sum.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/5xsbSsZc/Chat-GPT-Image-Apr-26-2026-10-49-43-PM.png',
        placeholder: 'plus',
        demo: 'https://sum-checker.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Positive & Negative Checker',
        desc: 'A simple application to check if a number is positive or negative.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/spvFYWBf/Chat-GPT-Image-Apr-26-2026-10-57-44-PM.png',
        placeholder: 'plusminus',
        demo: 'https://positive-negative-checker.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Tasbeeh Counter',
        desc: 'A simple application to count tasbeeh (glory praises).',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/B2pCGCNV/Chat-GPT-Image-Apr-26-2026-11-00-21-PM.png',
        placeholder: 'beads',
        demo: 'https://tassbeeh-counter.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Hzoori Watches',
        desc: 'Make a website in HTML, CSS & JavaScript for premium watch brand.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/Y7pyCFm2/Screenshot-2026-04-26-230236.png',
        placeholder: 'watch',
        demo: 'https://hzoori-watches.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Hdr Fawad Ahmed',
        desc: 'A responsive HTML, CSS & JavaScript website built for client Fawad Ahmed with a clean, modern layout.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/BK4HqhNR/image.png',
        placeholder: '',
        demo: 'https://hdr-fawad-ahmed.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Homeo Order System',
        desc: 'An order management website built for a homeopathic clinic business, allowing customers to browse and place orders online.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/BHs4fM2F/image.png',
        placeholder: '',
        demo: 'https://homeo-order-website.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Todo List App',
        desc: 'A simple and clean todo list application to add, complete, and manage daily tasks.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/4ny8wPZP/image.png',
        placeholder: '',
        demo: 'https://todo-list-by-hasnain.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Zaidi Homoeo Clinic',
        desc: 'A responsive website for a homeopathic clinic, providing information about services and allowing online appointment booking.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: 'https://i.ibb.co/jPnqzMm0/Chat-GPT-Image-Aug-26-2026-10-48-53-AM.png',
        placeholder: '',
        demo: 'https://zaidi-homoeo-clinic.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
];