/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const LocalContext = createContext(null);

const SELECTED_LOCAL_KEY = "selected-local";

export function LocalProvider({ children }) {
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [userLocales, setUserLocales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize and fetch locales on mount
  useEffect(() => {
    async function fetchLocales() {
      try {
        const res = await fetch("http://localhost:3000/api/locales", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const locales = data.locales || [];
          setUserLocales(locales);

          // Restore previously selected local from localStorage
          try {
            const savedId = localStorage.getItem(SELECTED_LOCAL_KEY);
            if (savedId) {
              const match = locales.find((l) => String(l.id) === savedId);
              if (match) setSelectedLocal(match);
            }
          } catch (e) {
            console.error("Failed to restore selected local", e);
          }
        }
      } catch (err) {
        console.error("Failed to fetch locales", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLocales();
  }, []);

  // Helper function to change local (persists to localStorage)
  const changeLocal = (local) => {
    setSelectedLocal(local);
    try {
      if (local?.id) {
        localStorage.setItem(SELECTED_LOCAL_KEY, String(local.id));
      } else {
        localStorage.removeItem(SELECTED_LOCAL_KEY);
      }
    } catch (e) {
      console.error("Failed to save selected local", e);
    }
  };

  return (
    <LocalContext.Provider
      value={{
        selectedLocal,
        changeLocal,
        userLocales,
        setUserLocales,
        loading,
      }}
    >
      {children}
    </LocalContext.Provider>
  );
}

// Custom hook to use the local context
export function useLocal() {
  const context = useContext(LocalContext);
  if (!context) {
    throw new Error("useLocal must be used within a LocalProvider");
  }
  return context;
}
