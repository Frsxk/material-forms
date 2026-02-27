import type { Form, FormStats } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

// ─── Token helpers ───

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('auth_token');
}

// ─── Fetch wrapper ───

interface ApiError {
  error: string;
  fields?: { id: string; title: string }[];
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiResponseError(res.status, body);
  }

  return res.json();
}

export class ApiResponseError extends Error {
  constructor(
    public status: number,
    public body: ApiError
  ) {
    super(body.error ?? `API error ${status}`);
    this.name = 'ApiResponseError';
  }
}

// ─── Auth ───

export interface AuthResponse {
  token: string;
  user: { id: string; name: string | null; email: string };
}

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
}

export function authRegister(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function authLogin(data: { email: string; password: string }): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function authMe(): Promise<SafeUser> {
  return apiFetch<SafeUser>('/auth/me');
}

// ─── Forms (auth-required) ───

export function getForms(): Promise<Form[]> {
  return apiFetch<Form[]>('/forms');
}

export function getForm(id: string): Promise<Form> {
  return apiFetch<Form>(`/forms/${id}`);
}

export function createForm(data?: {
  title?: string;
  description?: string;
  themeColor?: string;
}): Promise<Form> {
  return apiFetch<Form>('/forms', {
    method: 'POST',
    body: JSON.stringify(data ?? {}),
  });
}

export function updateForm(
  id: string,
  data: Partial<Pick<Form, 'title' | 'description' | 'themeColor' | 'questions'>>
): Promise<Form> {
  return apiFetch<Form>(`/forms/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteForm(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/forms/${id}`, {
    method: 'DELETE',
  });
}

export function publishForm(id: string): Promise<Form> {
  return apiFetch<Form>(`/forms/${id}/publish`, { method: 'POST' });
}

export function closeForm(id: string): Promise<Form> {
  return apiFetch<Form>(`/forms/${id}/close`, { method: 'POST' });
}

// ─── Public (no auth) ───

export interface PublicForm {
  id: string;
  title: string;
  description: string | null;
  themeColor: string;
  questions: Form['questions'];
}

export function getPublicForm(id: string): Promise<PublicForm> {
  return apiFetch<PublicForm>(`/public/forms/${id}`);
}

export function submitForm(
  id: string,
  answers: Record<string, string | string[]>
): Promise<{ id: string; submittedAt: string }> {
  return apiFetch<{ id: string; submittedAt: string }>(
    `/public/forms/${id}/submit`,
    {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }
  );
}

// ─── Stats (auth-required) ───

export function getFormStats(id: string): Promise<FormStats> {
  return apiFetch<FormStats>(`/forms/${id}/stats`);
}
