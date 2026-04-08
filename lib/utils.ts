/**
 * Sets a browser cookie with the given name, value and expiration.
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 365)
 */
export function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

/**
 * Reads a cookie value by name from `document.cookie`.
 * Returns `null` when running server-side or when the cookie is absent.
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

/**
 * Formats a date into a human-readable localized string (e.g. "5 апреля 2025").
 * @param date - Date object or ISO string
 * @param locale - "ru" for Russian, "kz" for Kazakh
 */
export function formatDate(date: Date | string, locale = "ru"): string {
  return new Date(date).toLocaleDateString(locale === "kz" ? "kk-KZ" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Returns a human-readable relative time string (e.g. "5м назад").
 * Falls back to {@link formatDate} for dates older than 30 days.
 * @param date - Date object or ISO string
 */
export function timeAgo(date: Date | string): string {
  const elapsedSeconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (elapsedSeconds < 60) return `${elapsedSeconds}с назад`;
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}м назад`;
  if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)}ч назад`;
  if (elapsedSeconds < 2592000) return `${Math.floor(elapsedSeconds / 86400)}д назад`;
  return formatDate(date);
}
