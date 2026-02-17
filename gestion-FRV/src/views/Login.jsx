import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen flex flex-col relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        {/* Noise overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDL2fnosvTiChr0eaqfhcIRl04UZkJMofbFNGLKwqi5PlTQF_4XmfPkrhyEQCOkY9qzFzqGInJRLEgskZneyxv9hICreTAQg1L_ZAGWRlXVOUMHWc6WhYBQGpoeEFLQEmIqMBwHrZIhIWR85vlIldAoPE2SkJjynLWXrSKMwY-V0wl4Tl0shSBteDLZzkIiSQMHVcvlGEZ9-7WaZJBRPSkIp7EC-kP8zMkHZIS6SGmITNwr7pszoCwa9cETTcn-zjWLTj72r6l55b6')",
          }}
        ></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-6">
        {/* Glass Card Container */}
        <div className="glass-card w-full max-w-[480px] rounded-2xl p-8 md:p-12 relative shadow-glow transform transition-all duration-500 hover:shadow-glow-primary/20">
          {/* Floating Forgot Password Button */}
          <button
            className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-lg flex items-center justify-center hover:scale-110 transition-transform group cursor-pointer"
            title="Forgot Password?"
          >
            <span className="material-symbols-outlined text-white/80 group-hover:text-primary transition-colors">
              add
            </span>
          </button>
          {/* Card Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 mb-6 shadow-inner">
              <span className="material-symbols-outlined text-3xl text-white">
                lock_open
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-white/60 text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>
          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-white/70 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="glass-input w-full rounded-xl py-3.5 pl-11 pr-4 text-sm placeholder:text-white/30 focus:ring-0 transition-all duration-300 bg-black/20 border border-white/10 text-white focus:border-primary focus:bg-black/40 outline-none"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-white/70 ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors text-[20px]">
                    key
                  </span>
                </div>
                <input
                  className="glass-input w-full rounded-xl py-3.5 pl-11 pr-4 text-sm placeholder:text-white/30 focus:ring-0 transition-all duration-300 bg-black/20 border border-white/10 text-white focus:border-primary focus:bg-black/40 outline-none"
                  id="password"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-white/40 hover:text-white transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    visibility_off
                  </span>
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-glow-primary hover:shadow-glow-violet transition-all duration-300 transform active:scale-[0.98] mt-4 group flex items-center justify-center gap-2"
              type="submit"
            >
              <span>Sign In</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            {/* Footer Links */}
            <div className="flex items-center justify-between text-sm mt-8 pt-6 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded border-white/20 bg-white/5 text-primary focus:ring-0 focus:ring-offset-0 w-4 h-4 checked:bg-primary"
                  type="checkbox"
                />
                <span className="text-white/60 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                to="/register"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </main>
      {/* Decorative Bottom Gradient */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-dark to-transparent pointer-events-none z-0"></div>
    </div>
  );
}
