import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLang } from "../context/LangContext";

const Pricing = () => {
  const { t } = useLang();

  return (
    <section className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            {t.pricing.title}
          </motion.h2>
          <p className="text-xl">{t.pricing.subtitle}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
          {t.pricing.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`card relative flex flex-col h-full ${
                plan.recommended ? "ring-2 ring-[var(--accent-color)]" : ""
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-[var(--accent-color)] text-white text-xs font-semibold rounded-full">
                    Recommended
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-1 pt-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-[var(--text-secondary)] text-lg">
                  /mo
                </span>
              </div>

              {/* Features List */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Check
                        size={18}
                        className={
                          plan.recommended
                            ? "text-[var(--accent-color)]"
                            : "text-[var(--text-secondary)]"
                        }
                      />
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full btn ${
                  plan.recommended ? "btn-primary" : "btn-outline"
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
