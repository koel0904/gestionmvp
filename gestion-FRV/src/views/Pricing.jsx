import { useState } from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <>
      <div className="fixed top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-accent-purple)]/20 rounded-full blur-[160px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col items-center">
        <section className="w-full max-w-4xl px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Flexible Pricing
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-500">
            Plans for every stage.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Simple, transparent pricing that scales with your business. Choose
            the plan that fits your current needs.
          </p>
          <div className="inline-flex items-center p-1.5 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/10">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                billingCycle === "monthly"
                  ? "bg-white text-black shadow-md border border-black/5"
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-white text-black shadow-md border border-black/5"
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Annual
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px]">
                -20%
              </span>
            </button>
          </div>
        </section>

        <section className="w-full max-w-7xl px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="frosted-glass p-10 rounded-3xl flex flex-col relative h-full">
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                  Starter
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black dark:text-white">
                    $0
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    /mo
                  </span>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Perfect for freelancers and side projects getting started.
                </p>
              </div>
              <button className="w-full py-4 rounded-xl border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white font-bold transition-all mb-10 cursor-pointer">
                Get Started
              </button>
              <div className="space-y-5 flex-grow">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    5 Managed Projects
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Basic Analytics
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    24h Support Turnaround
                  </span>
                </div>
              </div>
              <div className="mt-12 flex justify-center">
                <button className="size-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center transition-all group cursor-pointer">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-black dark:group-hover:text-white">
                    add
                  </span>
                </button>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="frosted-glass pro-glow-effect pro-glow-shadow p-10 rounded-3xl flex flex-col relative h-full scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-[var(--color-accent-purple)] text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                Recommended
              </div>
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                  Professional
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black dark:text-white">
                    $49
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    /mo
                  </span>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Comprehensive tools for growing businesses and agencies.
                </p>
              </div>
              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-[var(--color-accent-purple)] text-white font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all mb-10 cursor-pointer">
                Choose Pro
              </button>
              <div className="space-y-5 flex-grow">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl filled-icon">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                    Unlimited Projects
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[var(--color-accent-purple)] text-xl filled-icon">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                    Advanced Automation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl filled-icon">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                    Real-time Team Sync
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[var(--color-accent-purple)] text-xl filled-icon">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                    Priority 1h Support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl filled-icon">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                    Custom Branding
                  </span>
                </div>
              </div>
              <div className="mt-12 flex justify-center">
                <button className="size-10 rounded-full border border-black/20 dark:border-white/20 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center transition-all group cursor-pointer">
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">
                    add
                  </span>
                </button>
              </div>
            </div>

            {/* Scale Plan */}
            <div className="frosted-glass p-10 rounded-3xl flex flex-col relative h-full">
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                  Scale
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black dark:text-white">
                    $199
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    /mo
                  </span>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Advanced security and dedicated support for large teams.
                </p>
              </div>
              <button className="w-full py-4 rounded-xl border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white font-bold transition-all mb-10 cursor-pointer">
                Contact Sales
              </button>
              <div className="space-y-5 flex-grow">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Dedicated Account Manager
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Custom API Access
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    SSO & SAML Integration
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">
                    check_circle
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    99.99% Uptime SLA
                  </span>
                </div>
              </div>
              <div className="mt-12 flex justify-center">
                <button className="size-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center transition-all group cursor-pointer">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-black dark:group-hover:text-white">
                    add
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-t border-black/5 dark:border-white/10 py-20 bg-black/[0.02] dark:bg-white/[0.02] mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mb-12">
              Empowering teams at world-class companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="h-8 flex items-center font-bold text-2xl tracking-tighter text-black dark:text-white">
                VANTAGE
              </div>
              <div className="h-8 flex items-center font-serif italic text-2xl text-black dark:text-white">
                Lumina
              </div>
              <div className="h-8 flex items-center font-mono text-xl text-black dark:text-white">
                QUANTUM.IO
              </div>
              <div className="h-8 flex items-center font-extrabold text-2xl uppercase text-black dark:text-white">
                Vertex
              </div>
              <div className="h-8 flex items-center font-medium text-2xl tracking-widest text-black dark:text-white">
                NEXUS
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Pricing;
