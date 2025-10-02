const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...headers,
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // ignore parse error
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message || (data.details && Array.isArray(data.details) && data.details.map(d => d.message).join(', ')))) ||
      res.statusText ||
      'Request failed';
    const err = new Error(message);
    err.raw = data;
    err.status = res.status;
    throw err;
  }

  return data;
}
