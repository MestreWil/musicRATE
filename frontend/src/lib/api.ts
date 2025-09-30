import { ApiError } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  auth?: boolean; // futuramente para incluir token
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
  const res = await fetch(url, {
    ...options,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...(options.headers || {})
    },
    cache: 'no-store'
  });
  return handleResponse<T>(res);
}

export async function apiPost<T, B = any>(path: string, body: B, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: JSON.stringify(body)
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      ...(options.headers || {})
    }
  });
  return handleResponse<T>(res);
}
