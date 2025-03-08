"use client"
// Client-side language utilities
export const getClientLanguage = () => {
  if (typeof document === 'undefined') {
    return false; // Default to English when document is not available (server-side)
  }
  return document.cookie.includes("IS_LANG=bn");
};

export const toggleLanguage = (currentLang: boolean) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return; // Exit if running on server-side
  }
  document.cookie = `IS_LANG=${currentLang ? "en" : "bn"}; path=/`;
  window.location.reload();
};
