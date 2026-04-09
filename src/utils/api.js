/*
Purpose
- Centralizes API base URL handling for client requests.
- Avoids hardcoding endpoints across the app.

How It Works
- getApiBase() reads VITE_API_BASE_URL or defaults to '/api'.
- apiUrl(path) joins the base and a given path safely.

Where It Fits
- Used by features that call backend endpoints (e.g., Auth).
*/
export const getApiBase = () => {
  const envBase = import.meta?.env?.VITE_API_BASE_URL;
  if (envBase) return envBase.replace(/\/+$/, '');
  return '/api';
};

export const apiUrl = (path) => {
  const base = getApiBase();
  if (!path.startsWith('/')) path = `/${path}`;
  return `${base}${path}`;
};
