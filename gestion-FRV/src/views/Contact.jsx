const Contact = () => {
  return (
    <div className="bg-background-dark font-display min-h-screen flex flex-col bg-gradient-mesh relative overflow-x-hidden selection:bg-primary selection:text-white text-white">
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-10 lg:px-40">
        <div className="layout-content-container flex flex-col max-w-[1200px] w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-12 bg-primary"></span>
                  <h2 className="text-primary text-xs font-black uppercase tracking-[0.3em]">
                    Support Center
                  </h2>
                </div>
                <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tighter">
                  Let's build your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">
                    future
                  </span>{" "}
                  together.
                </h1>
                <p className="text-white/60 text-xl font-medium leading-relaxed max-w-[520px]">
                  Our experts are ready to help you scale your business
                  operations with extreme precision. Reach out and start your
                  journey today.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="glass-panel p-8 rounded-2xl flex flex-col gap-5 hover:border-white/30 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">
                      headset_mic
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-lg font-bold">
                      24/7 Priority Support
                    </h3>
                    <p className="text-white/50 text-sm font-medium leading-relaxed">
                      Direct line for enterprise partners anytime, anywhere.
                    </p>
                  </div>
                </div>
                <div className="glass-panel p-8 rounded-2xl flex flex-col gap-5 hover:border-white/30 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">
                      alternate_email
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-lg font-bold">
                      General Inquiries
                    </h3>
                    <p className="text-white/50 text-sm font-medium leading-relaxed">
                      hello@bizflow.io
                      <br />
                      Response in &lt; 4 hours.
                    </p>
                  </div>
                </div>
                <div className="glass-panel p-8 rounded-2xl flex flex-row gap-6 sm:col-span-2 items-center hover:border-white/30 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">
                      distance
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-white text-lg font-bold">Global HQ</h3>
                    <p className="text-white/50 text-sm font-medium">
                      Innovation Plaza, Suite 400, Silicon Valley, CA
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full opacity-30 -z-10"></div>
              <div className="glass-panel-violet p-8 md:p-12 rounded-[2.5rem] w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
                <form className="flex flex-col gap-8 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-white text-3xl font-extrabold tracking-tight">
                      Send a Message
                    </h3>
                    <p className="text-white/50 text-sm">
                      Fill out the form below and we'll get back to you shortly.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2.5">
                        <label className="text-white/70 text-xs font-black uppercase tracking-widest ml-1">
                          Full Name
                        </label>
                        <input
                          className="glass-input w-full px-5 py-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0"
                          placeholder="John Doe"
                          type="text"
                        />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <label className="text-white/70 text-xs font-black uppercase tracking-widest ml-1">
                          Email Address
                        </label>
                        <input
                          className="glass-input w-full px-5 py-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0"
                          placeholder="john@company.com"
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-white/70 text-xs font-black uppercase tracking-widest ml-1">
                        Company Website
                      </label>
                      <input
                        className="glass-input w-full px-5 py-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0"
                        placeholder="https://yourcompany.com"
                        type="url"
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-white/70 text-xs font-black uppercase tracking-widest ml-1">
                        Message
                      </label>
                      <textarea
                        className="glass-input w-full px-5 py-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0 min-h-[140px] resize-none"
                        placeholder="Tell us about your project goals..."
                      ></textarea>
                    </div>
                  </div>
                  <button
                    className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg uppercase tracking-widest shadow-[0_20px_40px_rgba(244,140,37,0.3)] hover:shadow-[0_25px_50px_rgba(244,140,37,0.5)] hover:bg-orange-500 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
                    type="submit"
                  >
                    Initialize Project
                    <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform font-bold">
                      arrow_forward
                    </span>
                  </button>
                  <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                    End-to-end encrypted connection
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
