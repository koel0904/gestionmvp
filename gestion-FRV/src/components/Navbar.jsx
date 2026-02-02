import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LangContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  // Handle scroll for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.features, href: "/features" },
    { name: t.nav.pricing, href: "/pricing" },
    { name: t.nav.contact, href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-subtle shadow-sm" : "bg-[var(--bg-primary)]"
      }`}
      style={{ height: "52px" }}
    >
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight flex items-center gap-1"
        >
          Gestion<span className="text-[var(--accent-color)]">App</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--accent-color)] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-[var(--text-secondary)]" />
            ) : (
              <Moon size={18} className="text-[var(--text-secondary)]" />
            )}
          </button>

          <button
            onClick={toggleLang}
            className="px-3 py-1.5 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]"
            aria-label="Toggle Language"
          >
            <Globe size={16} />
            <span className="uppercase">{lang}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={22} className="text-[var(--text-primary)]" />
          ) : (
            <Menu size={22} className="text-[var(--text-primary)]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-subtle border-t border-[var(--border-subtle)] absolute w-full top-full left-0"
          >
            <div className="container flex flex-col py-4 gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[var(--text-primary)] bg-[var(--bg-secondary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === "dark" ? "Light" : "Dark"}</span>
                </button>
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase"
                >
                  <Globe size={18} />
                  <span>{lang}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
