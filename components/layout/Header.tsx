"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Icon } from "@/components/ui/Icon";

interface HeaderProps {
  session: { user?: { name?: string | null; email?: string | null; role?: string } } | null;
  locale: string;
}

export function Header({ session, locale }: HeaderProps) {
  const t = useTranslations("nav");
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const toggleLang = () => {
    const next = locale === "kz" ? "ru" : "kz";
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  const links = [
    { href: "/",        label: t("feed") },
    { href: "/submit",  label: t("submit") },
    ...(user    ? [{ href: "/cabinet", label: t("cabinet") }] : []),
    ...(isAdmin ? [{ href: "/admin",   label: t("admin")   }] : []),
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="header-logo">
          <span className="header-logo-mark">
            <Icon name="building" size={20} />
          </span>
          <span className="header-logo-text">{t("logo")}</span>
        </Link>

        <nav className={`header-nav${open ? " open" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`header-nav-link${path === l.href ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="header-end">
          <button className="lang-btn" onClick={toggleLang} title="Язык / Тіл">
            {locale === "kz" ? "ҚАЗ" : "РУС"}
          </button>

          <button className="icon-btn" onClick={toggleTheme} title="Тема">
            <Icon name="sun" size={15} />
          </button>

          {user ? (
            <>
              <div className="header-avatar">
                {(user.name ?? user.email ?? "U")[0].toUpperCase()}
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ gap: 5 }}
              >
                <Icon name="logOut" size={13} />
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">{t("login")}</Link>
              <Link href="/auth/register" className="btn btn-secondary btn-sm">{t("register")}</Link>
            </>
          )}

          <button className="header-hamburger" onClick={() => setOpen(!open)}>
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
