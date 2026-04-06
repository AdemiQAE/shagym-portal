"use client";

interface LanguageSwitcherProps {
  locale: string;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const toggleLang = () => {
    const next = locale === "kz" ? "ru" : "kz";
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <button className="lang-btn" onClick={toggleLang} title="Язык / Тіл">
      <span className={locale === "kz" ? "active" : ""}>KZ</span>
      <span className="lang-sep">/</span>
      <span className={locale === "ru" ? "active" : ""}>RU</span>
    </button>
  );
}
