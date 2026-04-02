const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export function getAuthToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem('thb_auth_token') || '';
}

export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  if (!token) window.localStorage.removeItem('thb_auth_token');
  else window.localStorage.setItem('thb_auth_token', token);
}

export async function apiRequest(path, options = {}) {
  const hasTokenOption = Object.prototype.hasOwnProperty.call(options, 'token');
  const token = hasTokenOption ? options.token : getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = payload?.message || payload || 'Request failed';
    throw new Error(message);
  }

  return payload;
}
