"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Icon } from "@/components/ui/Icon";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="icon-btn theme-switcher"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.15 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Icon name={theme === "dark" ? "moon" : "sun"} size={18} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
