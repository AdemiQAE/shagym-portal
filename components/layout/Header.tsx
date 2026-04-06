"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  session: { user?: { name?: string | null; email?: string | null; role?: string } } | null;
  locale: string;
}

export function Header({ session, locale }: HeaderProps) {
  const t = useTranslations("nav");
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  const links = [
    { href: "/", label: t("feed"), icon: "grid" },
    { href: "/submit", label: t("submit"), icon: "plus" },
    ...(user ? [{ href: "/cabinet", label: t("cabinet"), icon: "user" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: t("admin"), icon: "shield" }] : []),
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />

        {/* Desktop Nav */}
        <nav className="header-nav-desktop">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`header-nav-link${path === l.href ? " active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="header-end">
          <div className="header-controls">
            <LanguageSwitcher locale={locale} />
            <ThemeSwitcher />
          </div>

          <div className="header-auth-desktop">
            {user ? (
              <div className="header-user">
                <div className="header-avatar" title={user.name ?? user.email ?? "User"}>
                  {(user.name ?? user.email ?? "U")[0].toUpperCase()}
                </div>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title={t("logout")}
                >
                  <Icon name="logOut" size={16} />
                </button>
              </div>
            ) : (
              <div className="header-auth-btns">
                <Link href="/auth/login" className="btn btn-ghost btn-sm">{t("login")}</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm">{t("register")}</Link>
              </div>
            )}
          </div>

          <button 
            className={`header-hamburger${open ? " active" : ""}`} 
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="hamburger-box">
              <div className="hamburger-inner" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="mobile-menu-inner">
                <div className="mobile-menu-header">
                  <Logo />
                  <button className="icon-btn" onClick={() => setOpen(false)}>
                    <Icon name="close" size={20} />
                  </button>
                </div>

                <div className="mobile-menu-nav">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`mobile-nav-link${path === l.href ? " active" : ""}`}
                    >
                      <Icon name={l.icon as any} size={18} />
                      {l.label}
                    </Link>
                  ))}
                </div>

                <div className="mobile-menu-footer">
                  <div className="mobile-menu-row">
                    <span>{t("logout")} / {t("login")}</span>
                    <div className="header-controls">
                      <LanguageSwitcher locale={locale} />
                      <ThemeSwitcher />
                    </div>
                  </div>
                  
                  {user ? (
                    <div className="mobile-user-info">
                      <div className="header-avatar">
                        {(user.name ?? user.email ?? "U")[0].toUpperCase()}
                      </div>
                      <div className="user-details">
                        <p className="user-name">{user.name ?? "—"}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        style={{ marginLeft: "auto" }}
                      >
                        {t("logout")}
                      </button>
                    </div>
                  ) : (
                    <div className="mobile-auth-btns">
                      <Link href="/auth/login" className="btn btn-ghost">{t("login")}</Link>
                      <Link href="/auth/register" className="btn btn-primary">{t("register")}</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
