const AUTH_KEY = 'token';
const USER_KEY = 'user';
const AUTH_VERSION = 'auth_version';
const CURRENT_VERSION = 1;

function isAuthStorage(storage: Storage | null): boolean {
  if (!storage) return false;
  const version = storage.getItem(AUTH_VERSION);
  return version === String(CURRENT_VERSION);
}

function getFromCookies(): { token: string | null; user: string | null } {
  if (typeof document === 'undefined') return { token: null, user: null };
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      if (cookieValue && cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
        return cookieValue.slice(1, -1);
      }
      return cookieValue || null;
    }
    return null;
  };
  return { token: getCookie(AUTH_KEY), user: getCookie(USER_KEY) };
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = getFromCookies();
  if (cookies.token) return cookies.token;
  if (isAuthStorage(sessionStorage)) {
    return sessionStorage.getItem(AUTH_KEY);
  }
  if (isAuthStorage(localStorage)) {
    return localStorage.getItem(AUTH_KEY);
  }
  return null;
}

export function getUser(): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = getFromCookies();
  if (cookies.user) return cookies.user;
  if (isAuthStorage(sessionStorage)) {
    return sessionStorage.getItem(USER_KEY);
  }
  if (isAuthStorage(localStorage)) {
    return localStorage.getItem(USER_KEY);
  }
  return null;
}

export function setAuth(token: string, user: unknown, rememberMe: boolean): void {
  if (typeof window === 'undefined') return;
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
  storage.setItem(AUTH_VERSION, String(CURRENT_VERSION));

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 0;
  document.cookie = `${AUTH_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  ['localStorage', 'sessionStorage'].forEach((storageName) => {
    const storage = window[storageName as 'localStorage' | 'sessionStorage'];
    storage.removeItem(AUTH_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(AUTH_VERSION);
  });
  document.cookie = `${AUTH_KEY}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${USER_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
