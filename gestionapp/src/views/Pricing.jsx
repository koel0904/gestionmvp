import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLang } from "../context/LangContext";

const Pricing = () => {
  const { t } = useLang();

  return (
    <section id="pricing" className="section relative">
      {/* Background Decoration */}
      <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[var(--bg-secondary)] to-transparent -z-10"></div>

      <div className="container">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            {t.pricing.title}
          </motion.h2>
          <p className="text-[var(--text-secondary)] text-xl">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {t.pricing.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass rounded-2xl p-8 relative flex flex-col h-full ${
                plan.recommended
                  ? "border-[var(--accent-color)] shadow-2xl scale-105 z-10"
                  : "border-[var(--glass-border)]"
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--accent-color)] text-white px-4 py-1 rounded-full text-sm font-bold">
                  Recommended
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-extrabold mb-6">
                {plan.price}
                <span className="text-lg text-[var(--text-secondary)] font-normal">
                  /mo
                </span>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div
                      className={`p-1 rounded-full ${plan.recommended ? "bg-[var(--accent-color)] text-white" : "bg-[var(--bg-secondary)]"}`}
                    >
                      <Check size={14} />
                    </div>
                    <span className="text-[var(--text-secondary)]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.recommended
                    ? "bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] shadow-lg hover:shadow-orange-500/30"
                    : "bg-[var(--bg-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]"
                }`}
              >
                {t.pricing.subscribe}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
