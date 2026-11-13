// aakhir ka "/" khud hata deta hai (warna //api/... ban kar CORS/redirect error aata hai)
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim().replace(/\/+$/, '');

// Backend ki relative pic (/api/images/...) ko poora URL do; baaqi URLs jaise hain
export const resolveImg = (src) => (src && src.startsWith('/api/') ? `${API_URL}${src}` : src);

async function request(path, { headers, ...options } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { success: false, message: 'Unexpected server response.' };
  }

  if (!res.ok || !data.success) {
    const err = new Error(data.message || 'Request failed.');
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function sendContactMessage(payload) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---- Project likes & comments (sab visitors ke liye shared) ----

export async function fetchFeedback() {
  const data = await request('/api/feedback');
  return data.data || {};
}

export async function toggleLikeApi(projectId, action) {
  const data = await request(`/api/feedback/${projectId}/like`, {
    method: 'POST',
    body: JSON.stringify({ action }), // 'like' | 'unlike'
  });
  return data.likes;
}

export async function postCommentApi(projectId, { name, text }) {
  const data = await request(`/api/feedback/${projectId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ name, text }),
  });
  return data.comment; // { id, name, text, at, ownerToken }
}

// ownerToken: apna comment delete karne ke liye. adminKey: admin ho to kisi ka bhi.
export async function deleteCommentApi(projectId, commentId, { ownerToken, adminKey } = {}) {
  return request(`/api/feedback/${projectId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: adminKey ? { 'x-admin-key': adminKey } : undefined,
    body: JSON.stringify({ ownerToken }),
  });
}

// Admin password verify karne ke liye
export async function verifyAdminKey(key) {
  const data = await request('/api/feedback/admin/verify', {
    method: 'POST',
    body: JSON.stringify({ key }),
  });
  return data.success;
}

// ---- Projects (admin panel se manage hote hain) ----

export async function fetchProjects() {
  const data = await request('/api/projects');
  return data.projects || [];
}

const adminHeaders = (adminKey) => ({ 'x-admin-key': adminKey });

export const createProjectApi = async (adminKey, project) =>
  (await request('/api/projects', { method: 'POST', headers: adminHeaders(adminKey), body: JSON.stringify(project) })).project;

export const updateProjectApi = async (adminKey, id, project) =>
  (await request(`/api/projects/${id}`, { method: 'PUT', headers: adminHeaders(adminKey), body: JSON.stringify(project) })).project;

export const deleteProjectApi = (adminKey, id) =>
  request(`/api/projects/${id}`, { method: 'DELETE', headers: adminHeaders(adminKey) });

export const uploadProjectImageApi = async (adminKey, id, dataUrl) =>
  (await request(`/api/projects/${id}/image`, { method: 'POST', headers: adminHeaders(adminKey), body: JSON.stringify({ dataUrl }) })).project;

export const reorderProjectsApi = (adminKey, ids) =>
  request('/api/projects/reorder', { method: 'PUT', headers: adminHeaders(adminKey), body: JSON.stringify({ ids }) });

export const seedProjectsApi = (adminKey, projects) =>
  request('/api/projects/seed', { method: 'POST', headers: adminHeaders(adminKey), body: JSON.stringify({ projects }) });
