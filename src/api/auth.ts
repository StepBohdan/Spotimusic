export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function request<T>(path: string, options: RequestInit, retry = true): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    credentials: 'include',
  });

  // If we get 401 and this is an authenticated request, try to refresh token
  if (!res.ok && res.status === 401 && retry) {
    const isAuthEndpoint = path.startsWith('/auth/');
    
    if (!isAuthEndpoint) {
      try {
        // Try to refresh the token
        const newToken = await refreshToken();
        if (newToken) {
          // Retry the original request with new token if Authorization header was present
          const authHeader = options.headers && 'Authorization' in options.headers 
            ? options.headers['Authorization'] as string 
            : null;
          
          if (authHeader) {
            const newOptions = {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              },
            };
            return request<T>(path, newOptions, false);
          }
        }
      } catch {
        // Refresh failed, clear token
        localStorage.removeItem('accessToken');
        throw new Error('Session expired. Please log in again.');
      }
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

async function refreshToken(): Promise<string | null> {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing && refreshPromise) {
    const result = await refreshPromise;
    return result;
  }

  isRefreshing = true;
  refreshPromise = (async (): Promise<string | null> => {
    try {
      const { accessToken } = await request<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
      }, false); // Don't retry refresh itself
      
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch {
      localStorage.removeItem('accessToken');
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function login(email: string, password: string): Promise<{ accessToken: string; user: AuthUser }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string, username: string): Promise<{ accessToken: string; user: AuthUser }> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
}

export async function getMe(accessToken?: string): Promise<{ user: { sub: string; email?: string; username?: string } }> {
  const token = accessToken || localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token available');
  }

  try {
    return await request('/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const newToken = await refreshToken();
    if (newToken) {
      return request('/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      }, false); 
    }
    throw error;
  }
}

export async function refresh(): Promise<{accessToken: string}>{
  return request('/auth/refresh', {
    method: "POST",
  })
}

export async function logout(): Promise<{ ok: boolean }> {
  return request('/auth/logout', {
    method: 'POST',
  });
}
