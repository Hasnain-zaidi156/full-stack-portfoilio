// ============================================================
// Local helper — sirf *is* browser ki cheezein yahan rehti hain:
//   • kaun se projects ko is visitor ne like kiya (double-like rokne ke liye)
//   • apne comments ke ownerToken (delete karne ke liye zaroori)
//   • admin key (agar admin login kiya ho)
//   • visitor ka naam (dobara type na karna pade)
// Actual likes/comments MongoDB me hain — sab ko dikhte hain.
// ============================================================

const STORE = typeof window !== 'undefined' ? window.localStorage : null;

const LIKED_KEY = 'pf_liked_projects_v2';
const TOKENS_KEY = 'pf_my_comment_tokens_v1'; // { [commentId]: ownerToken }
const NAME_KEY = 'pf_visitor_name';
const ADMIN_KEY_STORAGE = 'pf_admin_key';

function read(key) {
  if (!STORE) return {};
  try {
    return JSON.parse(STORE.getItem(key) || '{}');
  } catch {
    return {};
  }
}

function write(key, value) {
  if (!STORE) return;
  try {
    STORE.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / storage full — ignore */
  }
}

// title -> stable slug (backend ka projectId)
export function slugify(title = '') {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const loadLiked = () => read(LIKED_KEY);
export const saveLiked = (map) => write(LIKED_KEY, map);

export const loadMyTokens = () => read(TOKENS_KEY);
export const saveMyTokens = (map) => write(TOKENS_KEY, map);

export function loadVisitorName() {
  if (!STORE) return '';
  try {
    return STORE.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function saveVisitorName(name) {
  if (!STORE) return;
  try {
    STORE.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

export function loadAdminKey() {
  if (!STORE) return '';
  try {
    return STORE.getItem(ADMIN_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function saveAdminKey(key) {
  if (!STORE) return;
  try {
    STORE.setItem(ADMIN_KEY_STORAGE, key);
  } catch {
    /* ignore */
  }
}

export function clearAdminKey() {
  if (!STORE) return;
  try {
    STORE.removeItem(ADMIN_KEY_STORAGE);
  } catch {
    /* ignore */
  }
}

// "2m ago" style short time
export function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(ts).toLocaleDateString();
}
