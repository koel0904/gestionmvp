/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const LocalContext = createContext(null);

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
          setUserLocales(data.locales || []);

          // If they already selected one previously (could save to localStorage), set it
          // For now, we leave it null so they hit the LocalsGrid
        }
      } catch (err) {
        console.error("Failed to fetch locales", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLocales();
  }, []);

  // Helper function to change local
  const changeLocal = (local) => {
    setSelectedLocal(local);
  };

  return (
    <LocalContext.Provider
      value={{ selectedLocal, changeLocal, userLocales, loading }}
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
