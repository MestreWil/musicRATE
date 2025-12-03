import { ApiError } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  auth?: boolean; // Incluir token de autenticação
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sanctum_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  return res.json();
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const authHeaders = options.auth !== false ? getAuthHeaders() : {};
  const res = await fetch(url, {
    ...options,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...authHeaders,
      ...(options.headers || {})
    },
    cache: 'no-store'
  });
  return handleResponse<T>(res);
}

export async function apiPost<T, B = any>(path: string, body: B, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const authHeaders = options.auth !== false ? getAuthHeaders() : {};
  const res = await fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {})
    },
    body: JSON.stringify(body)
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const authHeaders = options.auth !== false ? getAuthHeaders() : {};
  const res = await fetch(url, {
    ...options,
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      ...authHeaders,
      ...(options.headers || {})
    }
  });
  return handleResponse<T>(res);
}
