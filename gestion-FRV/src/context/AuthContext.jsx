/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:3000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch(`${API_URL}/me`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      }
      // not ok -> unauthenticated
      setUser(null);
      return null;
    } catch (err) {
      // Network or other error, consider user unauthenticated but do not force a navigation
      console.error("Auth check failed:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Exposed helper to let components re-check auth after login
  const refresh = async () => {
    return await checkAuth();
  };

  async function login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response:", res);

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Login failed");
    }

    const data = await res.json();
    setUser(data.user);
    // Guardar el email en localStorage para reutilizarlo (ej. prefill en el login)
    try {
      localStorage.setItem("savedEmail", email);
    } catch (e) {
      console.warn("No se pudo guardar el email en localStorage", e);
    }
    return data.user;
  }

  async function register(name, email, password) {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Registration failed");
    }

    const data = await res.json();
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    // Clear cookie by calling a logout endpoint or just clear state
    // For now, clear the cookie by making a request or clearing state
    setUser(null);
    // Remover el email guardado al hacer logout
    try {
      localStorage.removeItem("savedEmail");
    } catch (e) {
      console.warn("No se pudo remover el email de localStorage", e);
    }
    // Navigate will be handled by the component
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
