/*
  "Powered by Netlify" badge (#nl-badge / .nl-badge) ko chhupata hai.
  Netlify ye badge deploy ke baad page mein khud inject karta hai, isliye:
  1) CSS se foran hide, 2) MutationObserver se jab bhi dobara aaye hata do.
*/
const SELECTORS = ['#nl-badge', '.nl-badge', '#nl-card', '.nl-card'];

export function hideNetlifyBadge() {
  if (typeof document === 'undefined') return;

  // 1) CSS — badge render hone se pehle hi chhupa rahe
  if (!document.getElementById('hide-nl-badge-css')) {
    const style = document.createElement('style');
    style.id = 'hide-nl-badge-css';
    style.textContent =
      SELECTORS.join(',') + '{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    document.head.appendChild(style);
  }

  // 2) DOM se hata do (jab bhi inject ho)
  const sweep = () => document.querySelectorAll(SELECTORS.join(',')).forEach((el) => el.remove());
  sweep();

  const root = document.documentElement;
  new MutationObserver(sweep).observe(root, { childList: true, subtree: true });
}
