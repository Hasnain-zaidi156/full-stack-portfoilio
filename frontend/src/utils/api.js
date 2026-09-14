const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function sendContactMessage(payload) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { success: false, message: 'Unexpected server response.' };
  }

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to send message.');
  }

  return data;
}
