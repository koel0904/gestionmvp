import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:3000/api";

export default function TwoFALogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useAuth();
  const savedEmail =
    typeof window !== "undefined" ? localStorage.getItem("savedEmail") : "";
  const initialEmail =
    (location.state && location.state.email) || savedEmail || "";

  const [email] = useState(initialEmail);
  const [passwordForResend, setPasswordForResend] = useState("");
  const [showPasswordForResend, setShowPasswordForResend] = useState(false);

  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // focus first input on mount
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && inputsRef.current[idx + 1]) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        const next = [...code];
        next[idx] = "";
        setCode(next);
      } else if (inputsRef.current[idx - 1]) {
        inputsRef.current[idx - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && inputsRef.current[idx - 1]) {
      inputsRef.current[idx - 1].focus();
    } else if (e.key === "ArrowRight" && inputsRef.current[idx + 1]) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const digits = paste.replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 0) return;
    const next = [...code];
    for (let i = 0; i < 6; i++) next[i] = digits[i] || "";
    setCode(next);
    const firstEmpty = next.findIndex((c) => c === "");
    const focusIdx = firstEmpty === -1 ? 5 : firstEmpty;
    inputsRef.current[focusIdx]?.focus();
  };

  const submitCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    const codeStr = code.join("");
    if (codeStr.length !== 6) {
      setError("Introduce los 6 dígitos del código.");
      return;
    }
    if (!email) {
      setError(
        "Email faltante. Vuelve a iniciar sesión y proporciona tu email.",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login/2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: codeStr }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Código inválido o error del servidor");
      }

      // Re-check auth so the app picks up the cookie the server just set
      try {
        const refreshed = await refresh();
        if (!refreshed) {
          // If refresh failed, force a full /me fetch fallback or redirect to login
          setError(
            "No se pudo validar la sesión. Redirigiendo a inicio de sesión.",
          );
          setTimeout(() => navigate("/login"), 1000);
          return;
        }
      } catch (err) {
        console.error(err);
        setError("Error validando la sesión.");
        setTimeout(() => navigate("/login"), 1000);
        return;
      }

      setSuccessMsg("Autenticación correcta. Redirigiendo...");
      // Give a short delay for UX then navigate
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Error comprobando el código");
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setError("");
    setSuccessMsg("");
    if (!email) {
      setError("Necesitamos tu email para reenviar el código.");
      return;
    }
    // If we already have the password (user might have stored it), use it to request resend
    if (!passwordForResend) {
      // show password input to allow resend
      setShowPasswordForResend(true);
      setError("Ingresa tu contraseña para reenviar el código.");
      return;
    }

    setResendLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: passwordForResend }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo reenviar el código");
      }

      setSuccessMsg("Código reenviado. Revisa tu correo.");
    } catch (err) {
      setError(err.message || "Error reenviando el código");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="glass-card w-full max-w-md rounded-2xl p-8 md:p-10 relative shadow-glow">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 mb-4">
            <span className="material-symbols-outlined text-2xl text-white">
              vpn_key
            </span>
          </div>
          <h2 className="text-2xl font-bold">Verificación en dos pasos</h2>
          <p className="text-sm text-white/60 mt-1">
            Introduce el código de 6 dígitos enviado a tu correo.
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 p-3 rounded">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 text-sm text-green-200 bg-green-500/10 p-3 rounded">
            {successMsg}
          </div>
        )}

        <form onSubmit={submitCode} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-white/70">
              Email
            </label>
            <div className="glass-input w-full rounded-xl py-3 px-4 text-sm bg-black/20 border border-white/10 text-white flex items-center justify-between">
              <span className="truncate">
                {email || (
                  <span className="text-white/40">(No email guardado)</span>
                )}
              </span>
              {!email && (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-primary hover:underline"
                >
                  Volver a iniciar sesión
                </button>
              )}
            </div>
          </div>

          {showPasswordForResend && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-white/70">
                Contraseña (necesaria para reenviar)
              </label>
              <input
                type="password"
                value={passwordForResend}
                onChange={(e) => setPasswordForResend(e.target.value)}
                className="glass-input w-full rounded-xl py-3 px-4 text-sm placeholder:text-white/30 bg-black/20 border border-white/10"
                placeholder="••••••••"
              />
            </div>
          )}

          <div
            className="flex items-center justify-center gap-3 mt-2"
            onPaste={handlePaste}
          >
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 text-center rounded-xl bg-black/20 border border-white/10 text-xl font-mono focus:border-primary outline-none"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-glow-primary transition-all disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Verificar código"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={resendCode}
              disabled={resendLoading}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {resendLoading ? "Reenviando..." : "Reenviar código"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-white/60 hover:text-white/80"
            >
              Volver a iniciar sesión
            </button>
          </div>
        </form>

        <p className="mt-6 text-xs text-white/50 text-center">
          Si no recibes el correo revisa la carpeta de spam o espera unos
          minutos.
        </p>
      </div>
    </div>
  );
}
