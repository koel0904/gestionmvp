import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="font-display bg-background-dark text-white min-h-screen relative overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Ambient Background Elements */}
      <div className="noise-overlay fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-[0.03] bg-[url(https://lh3.googleusercontent.com/aida-public/AB6AXuBskCHA2deM-0qjXl247eOR2JfLVoU_EevKfdLoyouV8cKJFuIEqwRJOo_D2HPgA4LIDmDki6U57cO9hV5WKvK-q288ebXkOuYB-fviwWxElyv3PxPhxbJRi7Ami0HjwhnPmTOKMbaJ5zgp9NWqLtezKFyhBJp1HAe5s2k31HGyGR15d3rNZytnaMY90qQ0T1irDwLRM0qgp8RBMq4F8HDgjfLgDQbiwTxgPCFp2KOOX8DV_ZNrK_8UuWJtJTS8IBUD_RvIHmXueccm)]"></div>
      <div className="blob-orange absolute bg-[radial-gradient(circle,rgba(244,140,37,0.4)_0%,rgba(244,140,37,0)_70%)] blur-[60px] z-0 opacity-60 w-[500px] h-[500px] top-[-100px] left-[-100px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]"></div>
      <div className="blob-violet absolute bg-[radial-gradient(circle,rgba(139,92,246,0.4)_0%,rgba(139,92,246,0)_70%)] blur-[60px] z-0 opacity-50 w-[600px] h-[600px] bottom-[-150px] right-[-100px] rounded-full mix-blend-screen"></div>
      <div className="blob-orange absolute bg-[radial-gradient(circle,rgba(244,140,37,0.4)_0%,rgba(244,140,37,0)_70%)] blur-[60px] z-0 opacity-30 w-[300px] h-[300px] top-[40%] left-[20%] rounded-full"></div>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
        {/* Glass Registration Card */}
        <div className="glass-panel bg-white/5 backdrop-blur-[24px] border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] w-full max-w-[520px] rounded-2xl p-8 md:p-12 relative overflow-hidden group">
          {/* Decorative interior highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          {/* Header Section */}
          <div className="mb-10 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Start your journey
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Create your premium account today
            </p>
          </div>
          {/* Form */}
          <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}
            {/* Name Input */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2"
                htmlFor="name"
              >
                <span className="material-symbols-outlined text-base text-primary">
                  person
                </span>
                Full Name
              </label>
              <input
                className="glass-input w-full rounded-lg px-4 py-3.5 focus:ring-0 placeholder:text-gray-600 outline-none bg-black/20 border border-white/10 text-white transition-all duration-300 focus:bg-black/40 focus:border-primary focus:shadow-[0_0_15px_rgba(244,140,37,0.2)]"
                id="name"
                placeholder="John Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {/* Email Input */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2"
                htmlFor="email"
              >
                <span className="material-symbols-outlined text-base text-primary">
                  mail
                </span>
                Work Email
              </label>
              <input
                className="glass-input w-full rounded-lg px-4 py-3.5 focus:ring-0 placeholder:text-gray-600 outline-none bg-black/20 border border-white/10 text-white transition-all duration-300 focus:bg-black/40 focus:border-primary focus:shadow-[0_0_15px_rgba(244,140,37,0.2)]"
                id="email"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2"
                  htmlFor="password"
                >
                  <span className="material-symbols-outlined text-base text-primary">
                    lock
                  </span>
                  Password
                </label>
                <input
                  className="glass-input w-full rounded-lg px-4 py-3.5 focus:ring-0 placeholder:text-gray-600 outline-none bg-black/20 border border-white/10 text-white transition-all duration-300 focus:bg-black/40 focus:border-primary focus:shadow-[0_0_15px_rgba(244,140,37,0.2)]"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2"
                  htmlFor="confirmPassword"
                >
                  <span className="material-symbols-outlined text-base text-primary">
                    lock_reset
                  </span>
                  Confirm
                </label>
                <input
                  className="glass-input w-full rounded-lg px-4 py-3.5 focus:ring-0 placeholder:text-gray-600 outline-none bg-black/20 border border-white/10 text-white transition-all duration-300 focus:bg-black/40 focus:border-primary focus:shadow-[0_0_15px_rgba(244,140,37,0.2)]"
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* Terms Checkbox */}
            <div className="pt-2 flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  className="w-4 h-4 border border-white/20 rounded bg-white/5 focus:ring-primary focus:ring-offset-0 checked:bg-primary checked:border-primary text-primary cursor-pointer"
                  id="terms"
                  type="checkbox"
                  required
                />
              </div>
              <label
                className="text-sm text-gray-400 select-none"
                htmlFor="terms"
              >
                I agree to the{" "}
                <a
                  className="text-primary hover:text-accent-violet underline decoration-primary/30 transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            {/* Action Button */}
            <button
              className="w-full mt-4 bg-gradient-to-r from-primary to-accent-violet hover:from-orange-500 hover:to-violet-500 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base tracking-wide flex items-center justify-center gap-2 group/btn"
              type="submit"
            >
              Create Account
              <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">
                arrow_forward
              </span>
            </button>
          </form>
          {/* Floating Info Button */}
          <div className="absolute top-4 right-4 z-20 group/tooltip">
            <button className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all">
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
            {/* Floating Modal/Tooltip for Terms */}
            <div className="absolute right-0 top-10 w-64 p-4 glass-panel bg-white/5 backdrop-blur-[24px] border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 transform origin-top-right scale-95 group-hover/tooltip:scale-100 z-50">
              <h4 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">
                  gavel
                </span>
                Quick Terms
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                By registering, you agree to our standard SaaS terms. Your data
                is encrypted and we never sell your personal information to
                third parties.
              </p>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-8 text-center border-t border-white/5 pt-6 relative z-10">
            <Link
              className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1"
              to="/login"
            >
              Already have an account?{" "}
              <span className="text-primary font-semibold">Sign in</span>
            </Link>
          </div>
        </div>
        {/* Background Image for context (Subtle pattern) */}
        <div
          className="absolute bottom-0 w-full h-1/3 opacity-20 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay pointer-events-none"
          data-alt="Abstract dark fluid geometric shapes background pattern"
        ></div>
      </main>
    </div>
  );
}
