import React from 'react';

// ============================================================
// Shared inline SVG icon set. All icons use stroke="currentColor"
// so they inherit color from their parent (className / CSS),
// exactly like the emoji they replace used to.
// ============================================================

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconCart = (props) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <path d="M2.5 3h2l2.2 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
  </svg>
);

export const IconDocument = (props) => (
  <svg {...base} {...props}>
    <path d="M7 2.5h7l4 4V21a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" />
    <path d="M14 2.5V7h4" />
    <path d="M9 12h6M9 15.5h6M9 18.5h3.5" />
  </svg>
);

export const IconFood = (props) => (
  <svg {...base} {...props}>
    <path d="M5 2v7a2 2 0 0 0 2 2v11" />
    <path d="M5 2v5M8 2v5" />
    <path d="M18 2c-2.2 0-3.5 2-3.5 5s1.3 5 3.5 5v10" />
  </svg>
);

export const IconCoin = (props) => (
  <svg {...base} {...props}>
    <ellipse cx="12" cy="7" rx="7.5" ry="3.5" />
    <path d="M4.5 7v10c0 1.93 3.36 3.5 7.5 3.5s7.5-1.57 7.5-3.5V7" />
    <path d="M4.5 12c0 1.93 3.36 3.5 7.5 3.5s7.5-1.57 7.5-3.5" />
  </svg>
);

export const IconCalculator = (props) => (
  <svg {...base} {...props}>
    <rect x="4.5" y="2.5" width="15" height="19" rx="1.5" />
    <path d="M7 6.5h10" />
    <circle cx="7.3" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="16.7" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="7.3" cy="16" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="16.7" cy="16" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPlus = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconBeads = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="4.5" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="19.5" cy="14.5" r="2" />
    <circle cx="15.5" cy="19.5" r="2" />
    <circle cx="8.5" cy="19.5" r="2" />
    <circle cx="4.5" cy="14.5" r="2" />
    <circle cx="6" cy="8" r="2" />
  </svg>
);

export const IconWatch = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="6.5" />
    <path d="M12 9v3.2l2.2 1.3" />
    <path d="M9.5 3.5h5l-.6 3.2h-3.8l-.6-3.2Z" />
    <path d="M9.5 20.5h5l-.6-3.2h-3.8l-.6 3.2Z" />
  </svg>
);

export const IconSearch = (props) => (
  <svg {...base} {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.8-4.8" />
  </svg>
);

export const IconClose = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconDownload = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M4 19h16" />
  </svg>
);

export const IconMail = (props) => (
  <svg {...base} {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="M3 6.5l9 6.5 9-6.5" />
  </svg>
);

export const IconAtom = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="9.5" ry="4" />
    <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)" />
  </svg>
);

export const IconPlusMinus = (props) => (
  <svg {...base} {...props}>
    <path d="M8 4v6M5 7h6" />
    <path d="M5 17h6" />
    <path d="M14 12h6M14 20h6" />
  </svg>
);

export const IconSparkle = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3l1.8 5.6L19.5 10.5l-5.7 1.9L12 18l-1.8-5.6L4.5 10.5l5.7-1.9L12 3Z" />
  </svg>
);

