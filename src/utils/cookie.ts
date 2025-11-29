export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.split("; ").find(row => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function refreshCookie(name: string, days = 7) {
  const val = getCookie(name);
  if (val) setCookie(name, val, days);
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
}