/*
  "Powered by Netlify" badge hatata hai: class (.nl-badge / #nl-badge) se element
  dhoondh kar seedha remove() karta hai.

  Ye in sab cases ko handle karta hai:
  - badge page load ke baad inject ho (MutationObserver + pehle 20 sec har 300ms check)
  - badge kisi shadow DOM ke andar ho (open shadow roots mein bhi dhoondta hai)
  - badge kisi wrapper div mein ho (khali wrapper bhi hata deta hai)
  - class badal jaye (text "Powered by Netlify" se bhi pehchanta hai)
*/
const SELECTOR = '.nl-badge, #nl-badge, .nl-card, #nl-card';
const TEXT_RE = /^\s*powered by\s*netlify\s*$/i;

function removeFrom(root) {
  if (!root || !root.querySelectorAll) return;

  // 1) class / id se
  root.querySelectorAll(SELECTOR).forEach((el) => {
    const parent = el.parentElement;
    el.remove();
    // wrapper agar ab khali hai (aur app ka hissa nahi) to wo bhi hata do
    if (parent && !parent.children.length && !parent.id?.match(/^root$/) && parent !== document.body && parent !== document.documentElement) {
      parent.remove();
    }
  });

  // 2) fallback: chhota sa element jiska text sirf "Powered by Netlify" ho
  root.querySelectorAll('button, a, div, span').forEach((el) => {
    if (el.children.length <= 3 && TEXT_RE.test(el.textContent || '') && !el.closest('#root')) el.remove();
  });

  // 3) shadow DOM ke andar bhi dekho
  root.querySelectorAll('*').forEach((el) => {
    if (el.shadowRoot) removeFrom(el.shadowRoot);
  });
}

export function hideNetlifyBadge() {
  if (typeof document === 'undefined') return;

  // CSS — jab tak element remove na ho tab tak bhi nazar na aaye
  if (!document.getElementById('hide-nl-badge-css')) {
    const style = document.createElement('style');
    style.id = 'hide-nl-badge-css';
    style.textContent = `${SELECTOR}{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}`;
    document.head.appendChild(style);
  }

  const sweep = () => removeFrom(document);
  sweep();

  new MutationObserver(sweep).observe(document.documentElement, { childList: true, subtree: true });

  // shadow DOM ke andar ki changes observer ko nahi milti — isliye shuru ke 20 sec interval
  let n = 0;
  const t = setInterval(() => { sweep(); if (++n > 66) clearInterval(t); }, 300);
  window.addEventListener('load', () => setTimeout(sweep, 500));
}
