import { Link } from "react-router-dom";

const Features = () => {
  return (
    <>
      <section className="relative w-full px-6 py-10 lg:px-20 xl:px-40 pt-28">
        <div
          className="overflow-hidden rounded-3xl relative min-h-[450px] flex flex-col items-center justify-center text-center p-8 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7PThhELTRy4HNE7hrU22pRXxS0ZV0OhgcGYbbmo9RZB2MEBLADMr54WAIdjLPbg_tsMPdzHCNDKm1XH5XXZ_1luBeMDJovOP30tqVfbs4AO0G7noCHUIs3NiCjJRepxY7WGUffI-Hce1-rbMjygbaEsQxalyzp_rLUezgljT5346JBHhGKUfLx4uaKBxLefjO8-rmLpkT7emRkYTfDVHaKLLMv7hxhYuSp7Yy-HQkub2uYXffnbJU_e4BA9xxdvbia8UTdDsun7DG')",
          }}
        >
          <div className="relative z-10 max-w-3xl flex flex-col gap-6">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-7xl">
              Manage Your Business <br />
              <span className="text-primary">With Clarity</span>
            </h1>
            <p className="text-lg text-gray-200 md:text-xl max-w-2xl mx-auto">
              Streamline operations with our intuitive, glass-inspired platform
              designed for modern growth and transparent scaling.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button className="h-12 rounded-xl bg-primary px-10 text-base font-bold text-background-dark shadow-xl hover:bg-primary/90 transition-all cursor-pointer">
                Start Free Trial
              </button>
              <button className="h-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/30 px-10 text-base font-bold text-white hover:bg-white/20 transition-all cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pt-16 pb-6 lg:px-20 xl:px-40">
        <div className="flex flex-col gap-4 text-center md:text-left md:flex-row md:justify-between md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-3">
              Platform Capabilities
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Scale
              </span>
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-xl">
              Our platform integrates essential tools into a seamless interface,
              empowering your team to work smarter with deep visual insights.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all cursor-pointer">
            View All Features{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-20 xl:px-40 pb-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="heavy-glass group relative flex flex-col justify-between gap-6 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined text-white text-3xl">
                  monitoring
                </span>
              </div>
              <button
                aria-label="More details"
                className="plus-button-glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 group-hover:bg-primary group-hover:text-background-dark group-hover:border-primary/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h4>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Visualize your growth with real-time data charts. Track KPIs and
                performance metrics at a glance with crystal-clear precision.
              </p>
            </div>
          </div>
          <div className="heavy-glass group relative flex flex-col justify-between gap-6 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined text-white text-3xl">
                  groups
                </span>
              </div>
              <button
                aria-label="More details"
                className="plus-button-glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 group-hover:bg-primary group-hover:text-background-dark group-hover:border-primary/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Team Collaboration
              </h4>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Seamless communication channels built-in. Share files, comments,
                and updates instantly across your entire organization.
              </p>
            </div>
          </div>
          <div className="heavy-glass group relative flex flex-col justify-between gap-6 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined text-white text-3xl">
                  view_kanban
                </span>
              </div>
              <button
                aria-label="More details"
                className="plus-button-glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 group-hover:bg-primary group-hover:text-background-dark group-hover:border-primary/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Project Tracking
              </h4>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Keep projects on schedule with intuitive timelines, Kanban
                boards, and automated milestone tracking for transparency.
              </p>
            </div>
          </div>
          <div className="heavy-glass group relative flex flex-col justify-between gap-6 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined text-white text-3xl">
                  payments
                </span>
              </div>
              <button
                aria-label="More details"
                className="plus-button-glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 group-hover:bg-primary group-hover:text-background-dark group-hover:border-primary/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Financial Reports
              </h4>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Generate comprehensive financial statements, automated invoices,
                and expense reports with deep audit logs.
              </p>
            </div>
          </div>
          <div className="heavy-glass group relative flex flex-col justify-between gap-6 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined text-white text-3xl">
                  account_circle
                </span>
              </div>
              <button
                aria-label="More details"
                className="plus-button-glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 group-hover:bg-primary group-hover:text-background-dark group-hover:border-primary/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Client Management
              </h4>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                A dedicated high-visibility CRM to manage client relationships,
                communication history, and sales pipelines seamlessly.
              </p>
            </div>
          </div>
          <div className="heavy-glass group relative flex flex-col justify-between gap-6 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined text-white text-3xl">
                  bolt
                </span>
              </div>
              <button
                aria-label="More details"
                className="plus-button-glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 group-hover:bg-primary group-hover:text-background-dark group-hover:border-primary/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Automated Workflows
              </h4>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Set up triggers and actions to automate repetitive tasks and
                save hundreds of manual hours every single month.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-center md:hidden">
          <button className="flex h-12 w-full items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/20 transition-colors cursor-pointer">
            View All Features
          </button>
        </div>
      </section>

      <section className="bg-background-light dark:bg-background-dark border-t border-black/5 dark:border-white/5 pb-24">
        <div className="px-6 lg:px-20 xl:px-40 pt-20">
          <div
            className="rounded-[2.5rem] bg-[#2a2018] p-10 md:p-20 text-center relative overflow-hidden"
            style={{
              backgroundImage:
                "radial-gradient(circle at top right, rgba(244, 140, 37, 0.15), transparent 50%)",
            }}
          >
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-primary/10 blur-[100px]"></div>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl">
                Ready to Elevate Your Business?
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
                Join over 10,000+ companies using BizManage to scale faster and
                manage with unmatched clarity.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 mt-4 w-full justify-center">
                <button className="h-14 px-10 rounded-xl bg-primary text-background-dark font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 cursor-pointer">
                  Get Started Now
                </button>
                <button className="h-14 px-10 rounded-xl bg-transparent border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-all cursor-pointer">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
