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
    photo: '/images/profile.jpg',
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
        img: '/images/achievement-1-titan-certificate.jpg',
        isCertificate: true,
    },
    {
        title: 'Hackathon Certificate',
        desc: 'On 27 December 2025 in TITAN SAylani Sukkur our JavaScript test is duration 8 Hours.',
        img: '/images/achievement-2-hackathon-certificate.jpg',
    },
    {
        title: 'Mini Certificate',
        desc: 'This is my HTML, CSS & BOOTSTRAP test certificate.',
        img: '/images/achievement-3-mini-certificate.jpg',
    },
    {
        title: 'Internship Certificate',
        desc: 'This is my 2 months duration internship certificate. NOVASTACK HUB company',
        img: '/images/achievement-4-internship-certificate.png',
    },
    {
        title: 'Memory',
        desc: 'My last pic on 17 August 2026 with Sir Syed Sammar Abbas with Final Certificate.',
        img: '/images/achievement-5-memory.jpg',
    },
    {
        title: 'Memory',
        desc: 'My last pic on 17 August 2026 with Sir Yasir Ali Lashari with FInal Certificate.',
        img: '/images/achievement-6-memory.jpg',
    },
    {
        title: 'Memory',
        desc: 'Our last group picture Batch-1 with friends with certificate.',
        img: '/images/achievement-7-memory.jpg',
    },
    {
        title: 'Memory',
        desc: 'Our last pic in RT GRACE SUK on 5 August 2026 with friends and SIR YASIR LASHARI. Excellent Memory.',
        img: '/images/achievement-8-memory.jpg',
    },
    {
        title: 'Memory',
        desc: 'Our last pic in RT GRACE SUK on 5 August 2026 with friends and SIR YASIR LASHARI. Excellent Memory.',
        img: '/images/achievement-9-memory.jpg',
    },
    {
        title: 'Memory',
        desc: 'Our last pic in RT GRACE SUK on 5 August 2026 with friends and SIR YASIR LASHARI. Excellent Memory.',
        img: '/images/achievement-10-memory.jpg',
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
        img: '/images/project-1-online-universal-mart.jpg',
        placeholder: 'cart',
        demo: 'https://online-universal-mart.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Simple Resume Maker',
        desc: 'A clean resume builder with smooth user experience. Built with modern web technologies and best practices for structured resume output.',
        tags: ['HTML5', 'CSS3', 'Responsive', 'Animation'],
        img: '/images/project-2-simple-resume-maker.png',
        placeholder: 'document',
        demo: 'https://resumemaker-hasnain.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Mehfil e Zaiqa',
        desc: 'Modern restaurant website with menu display, online ordering system, and reservation functionality. Mobile-friendly and easy to navigate.',
        tags: ['HTML5', 'CSS3', 'JavaScript'],
        img: '/images/project-3-mehfil-e-zaiqa.png',
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
        img: '/images/project-6-sum-checker.png',
        placeholder: 'plus',
        demo: 'https://sum-checker.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Positive & Negative Checker',
        desc: 'A simple application to check if a number is positive or negative.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: '/images/project-7-positive-negative-checker.png',
        placeholder: 'plusminus',
        demo: 'https://positive-negative-checker.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Tasbeeh Counter',
        desc: 'A simple application to count tasbeeh (glory praises).',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: '/images/project-8-tasbeeh-counter.png',
        placeholder: 'beads',
        demo: 'https://tassbeeh-counter.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Hzoori Watches',
        desc: 'Make a website in HTML, CSS & JavaScript for premium watch brand.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: '/images/project-9-hzoori-watches.png',
        placeholder: 'watch',
        demo: 'https://hzoori-watches.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Hdr Fawad Ahmed',
        desc: 'A responsive HTML, CSS & JavaScript website built for client Fawad Ahmed with a clean, modern layout.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: '/images/project-10-hdr-fawad-ahmed.png',
        placeholder: '',
        demo: 'https://hdr-fawad-ahmed.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Homeo Order System',
        desc: 'An order management website built for a homeopathic clinic business, allowing customers to browse and place orders online.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: '/images/project-11-homeo-order-system.png',
        placeholder: '',
        demo: 'https://homeo-order-website.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Todo List App',
        desc: 'A simple and clean todo list application to add, complete, and manage daily tasks.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: '/images/project-12-todo-list-app.png',
        placeholder: '',
        demo: 'https://todo-list-by-hasnain.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
    {
        title: 'Zaidi Homoeo Clinic',
        desc: 'A responsive website for a homeopathic clinic, providing information about services and allowing online appointment booking.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
        img: '/images/project-13-zaidi-homoeo-clinic.png',
        placeholder: '',
        demo: 'https://zaidi-homoeo-clinic.netlify.app/',
        github: 'https://github.com/Hasnain-zaidi156',
    },
];