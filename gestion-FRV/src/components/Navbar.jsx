import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LangContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.features, href: "/features" },
    { name: t.nav.pricing, href: "/pricing" },
    { name: t.nav.contact, href: "/contact" },
  ];

  // Handle scroll for dynamic visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar if at the very top or scrolling up
      if (currentScrollY < 10 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-[100] w-full px-4 py-4 sm:px-10 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
        isVisible ? "translate-y-0" : "-translate-y-[150%]"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-2xl extreme-glass px-6 py-3 shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-xl bg-primary text-white shadow-lg shadow-primary/40">
            <span className="material-symbols-outlined text-[22px]">
              business_center
            </span>
          </div>
          <Link
            to="/"
            className={`text-xl font-extrabold tracking-tight transition-colors ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            BizManage
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-semibold transition-colors duration-300 hover:vibrant-accent-orange ${
                location.pathname === link.href
                  ? "text-primary vibrant-accent-orange"
                  : theme === "dark"
                    ? "text-white/80 hover:text-primary"
                    : "text-black/70 hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className={`extreme-glass-button flex h-10 items-center justify-center rounded-xl px-4 text-xs font-bold uppercase tracking-widest hover:text-primary ${
              theme === "dark" ? "text-white/90" : "text-black/90"
            }`}
          >
            {lang}
          </button>
          <button
            onClick={toggleTheme}
            className={`extreme-glass-button flex h-10 w-10 items-center justify-center rounded-xl hover:text-primary ${
              theme === "dark" ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden extreme-glass-button flex h-10 w-10 items-center justify-center rounded-xl text-black/90 dark:text-white/90"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 rounded-2xl extreme-glass p-4 flex flex-col gap-4 md:hidden shadow-2xl animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-semibold p-3 rounded-xl transition-all ${
                location.pathname === link.href
                  ? "bg-primary/10 text-primary font-bold"
                  : `hover:bg-white/5 hover:pl-4 ${theme === "dark" ? "text-white/70" : "text-black/70"}`
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
