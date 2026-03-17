const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ── Get token from localStorage ───────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// ── Get current user ──────────────────────────────────────────────────────────
export function getUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ── Get current tenant ────────────────────────────────────────────────────────
export function getTenant() {
  if (typeof window === 'undefined') return null;
  const tenant = localStorage.getItem('tenant');
  return tenant ? JSON.parse(tenant) : null;
}

// ── Check if logged in ────────────────────────────────────────────────────────
export function isLoggedIn(): boolean {
  return !!getToken();
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tenant');
  window.location.href = '/auth/login';
}

// ── Base API request ──────────────────────────────────────────────────────────
async function request(method: string, path: string, body?: any) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    request('POST', '/v1/auth/login', { email, password }),

  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    businessName: string;
    phone: string;
  }) => request('POST', '/v1/auth/register', data),

  me: () => request('GET', '/v1/auth/me'),
};

// ── Leads API ─────────────────────────────────────────────────────────────────
export const leadsAPI = {
  getAll: (params?: {
    status?: string;
    source?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.source) query.set('source', params.source);
    if (params?.search) query.set('search', params.search);
    if (params?.page)   query.set('page', String(params.page));
    if (params?.limit)  query.set('limit', String(params.limit));
    return request('GET', `/v1/leads?${query.toString()}`);
  },

  getOne: (id: string) =>
    request('GET', `/v1/leads/${id}`),

  create: (data: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    source?: string;
    status?: string;
    notes?: string;
  }) => request('POST', '/v1/leads', data),

  update: (id: string, data: any) =>
    request('PUT', `/v1/leads/${id}`, data),

  delete: (id: string) =>
    request('DELETE', `/v1/leads/${id}`),

  stats: () =>
    request('GET', '/v1/leads/stats/summary'),
};

// ── Messages API ──────────────────────────────────────────────────────────────
export const messagesAPI = {
  getByLead: (leadId: string) =>
    request('GET', `/v1/messages/lead/${leadId}`),

  send: (data: {
    leadId: string;
    content: string;
    channel: string;
  }) => request('POST', '/v1/messages', data),

  aiReply: (data: {
    leadId: string;
    message: string;
    channel: string;
  }) => request('POST', '/v1/messages/ai-reply', data),
};
