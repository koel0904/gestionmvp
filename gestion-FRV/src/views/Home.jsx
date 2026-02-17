import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="relative px-4 py-16 sm:px-10 lg:py-20 min-h-[90vh] flex items-center">
        <div className="mx-auto max-w-[1200px] w-full">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-8 text-left">
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl text-black dark:text-white">
                Manage Business with{" "}
                <span className="text-primary vibrant-accent-orange">
                  Total
                </span>{" "}
                <span className="text-[var(--color-accent-violet)] vibrant-accent-violet">
                  Clarity
                </span>
              </h1>
              <p className="text-xl text-black/60 dark:text-white/60 max-w-lg leading-relaxed">
                Experience the future of management with our extreme
                glassmorphism interface. Streamline your operations with vibrant
                efficiency.
              </p>
              <div className="flex flex-wrap gap-5 mt-4">
                <button className="flex h-14 items-center justify-center rounded-2xl bg-primary px-10 text-base font-bold text-white shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105">
                  Get Started Free
                </button>
                <div className="flex h-14 items-center justify-center rounded-2xl extreme-glass px-10 text-base font-bold text-black dark:text-white hover:border-white/30 transition-all cursor-pointer">
                  View Demo
                </div>
              </div>
            </div>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden extreme-glass p-3">
              <div
                className="w-full h-full rounded-2xl bg-center bg-cover border border-white/10"
                data-alt="Abstract dashboard charts"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALL4wCZ4CRHBgJgN2crW1z_Pb4YLG78wvqLWphIrDdLjfi_66M7Xbp0P6kgMYxADZ1GyTK4ye_yANk6_xWb1pZq2CzkwjoSAtuzdh6jm1uj3aumvNsOIE7i47UVDN_sRbhVL39onnRGS0ID4iZClXKjliTEiFg4204TOAQENjfp-TcLvIv5Khq2u0ALPgQvbbqot5dVEhZwQ7kMBcLvUZaZv_uDj6HZiSsrOyUwcdkH6Fug3Gj37GVNNOdWCJXjrl02104FKgTYZvu")',
                }}
              ></div>
              <div className="absolute -bottom-8 -left-8 hidden sm:flex extreme-glass p-5 rounded-2xl flex-col gap-3 w-56 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30">
                    <span className="material-symbols-outlined text-xl">
                      trending_up
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-tighter">
                      Growth Rate
                    </p>
                    <p className="text-lg font-black text-black dark:text-white">
                      +32.8%
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 hidden sm:flex extreme-glass p-4 rounded-2xl flex-col gap-2 w-40 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-[var(--color-accent-violet)]/20 flex items-center justify-center text-[var(--color-accent-violet)] border border-[var(--color-accent-violet)]/30">
                    <span className="material-symbols-outlined text-sm">
                      groups
                    </span>
                  </div>
                  <p className="text-xs font-bold text-black/80 dark:text-white/80">
                    Active Users
                  </p>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-accent-violet)] w-3/4 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-10">
        <div className="mx-auto max-w-[1200px] flex flex-col gap-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold tracking-tight mb-5 sm:text-5xl text-black dark:text-white">
                Future-Proof{" "}
                <span className="text-[var(--color-accent-violet)]">
                  Capabilities
                </span>
              </h2>
              <p className="text-black/60 dark:text-white/60 text-xl leading-relaxed">
                Our platform leverages cutting-edge design to provide an
                unparalleled user experience for modern businesses.
              </p>
            </div>
            <Link
              to="/features"
              className="extreme-glass-button flex items-center gap-3 px-6 py-3 rounded-xl text-primary font-bold transition-all group"
            >
              Explore All Features
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative flex flex-col gap-6 rounded-3xl extreme-glass p-6 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-6 right-6 z-10">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl extreme-glass bg-primary/20 text-primary border border-primary/40 shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">
                    add
                  </span>
                </button>
              </div>
              <div
                className="h-56 w-full rounded-2xl bg-cover bg-center border border-white/5"
                data-alt="Project tracking board"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIuK5WILL8YAu6JF6LTEPEs2T_rtwlQQc1UeZAjADN3iR_VZKK1rM9WlKE3hTfhsK1rlUsvl_2kJo8GwB0BvLoVKPWhEoK9003_o214k3sKkq1zq5oU5qE9g-uozyCk99_8tqLI4jF6QbQzsVU0eMYE8-HoYnxcu_1403N0sjWr7LpIpoZNS_jvkbGhVhF9eizsGoy-ofDJMHZNIn71BW3ISjwBqAZdtuAMY9Unc_VhE8hQCk_sEDgwPuqj78IoCVb-jL92SU52_E5")',
                }}
              ></div>
              <div className="px-2 pb-2">
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                  Project Velocity
                </h3>
                <p className="text-base text-black/50 dark:text-white/50 leading-relaxed">
                  Visualize your team's workflow with glass-textured boards
                  designed for speed.
                </p>
              </div>
            </div>
            <div className="group relative flex flex-col gap-6 rounded-3xl extreme-glass p-6 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-6 right-6 z-10">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl extreme-glass bg-[var(--color-accent-violet)]/20 text-[var(--color-accent-violet)] border border-[var(--color-accent-violet)]/40 shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">
                    add
                  </span>
                </button>
              </div>
              <div
                className="h-56 w-full rounded-2xl bg-cover bg-center border border-white/5"
                data-alt="Financial analytics"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhf_C5fTZRreVUCHT9irw3nX_twmMTrn4HXreBd-erjYY1iUOrwfD3BPzj2esquyKprtELneuqS6s9Rs6Ye3Lz6ljuQaqneWC7bejck6iMiJAC0sp0xv42z4Ai1dw2XJwxnJg9q6g0hRSaQePpPftV52E-zbUplUzINGjYfTRHvWdEO2LpzMnaAiPzNa7Vkm4DqDpmMAvfYotNqzvPTdF15jmabYdWjwnuuWSvDqHzAwqgwUIYX7RvyyQXSiygTulAXgTD0fpgQRH5")',
                }}
              ></div>
              <div className="px-2 pb-2">
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                  Crystal Analytics
                </h3>
                <p className="text-base text-black/50 dark:text-white/50 leading-relaxed">
                  Deep-dive into financial data with high-blur visualizations
                  and vibrant indicators.
                </p>
              </div>
            </div>
            <div className="group relative flex flex-col gap-6 rounded-3xl extreme-glass p-6 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-6 right-6 z-10">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl extreme-glass bg-primary/20 text-primary border border-primary/40 shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">
                    add
                  </span>
                </button>
              </div>
              <div
                className="h-56 w-full rounded-2xl bg-cover bg-center border border-white/5"
                data-alt="Team collaboration"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeHgvIyTh3dgDqm22xr-wa-xrIYTP75w78uhBw12lcUQ7Bk6IMWk7qBidebDlqUgQRcNOJkg9PVfjtF25OPMLUFuLSVLWQ9iD_krkPA7-djXwZDGGRkeiabaMOFVlTiQOxsiZfP-ZrWLYwOlwCyRDNX-lJtFq3S7ylcDRCXGxxdiPuJfvq7JqDRQDlIuZCpVPW7QeM1FB2ESS7YGazodue6YHGflZm-_uGMxv4t5hDXc6uQJZFwQwhYCzFSJ96GbYPYMYmxUF2QQ7a")',
                }}
              ></div>
              <div className="px-2 pb-2">
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                  Vibrant Collab
                </h3>
                <p className="text-base text-black/50 dark:text-white/50 leading-relaxed">
                  Foster innovation with communication tools that feel as light
                  as air but solid as glass.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-10 mb-20">
        <div className="mx-auto max-w-[1000px] rounded-[2.5rem] extreme-glass p-10 sm:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/30 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[var(--color-accent-violet)]/30 rounded-full blur-[100px]"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6 sm:text-5xl leading-tight text-black dark:text-white">
              Elevate Your Business To <br />
              <span className="text-primary vibrant-accent-orange">
                The Next Level
              </span>
            </h2>
            <p className="text-xl text-black/60 dark:text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Start your 14-day free trial today and join over 10,000 businesses
              scaling with our platform.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                className="flex-1 rounded-2xl extreme-glass border-black/10 dark:border-white/10 bg-white/5 px-6 py-4 text-base outline-none focus:ring-2 focus:ring-primary placeholder:text-black/30 dark:placeholder:text-white/30 text-black dark:text-white"
                placeholder="your@email.com"
                type="email"
              />
              <button className="rounded-2xl bg-primary px-8 py-4 font-extrabold text-white hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40">
                Start Free Trial
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
