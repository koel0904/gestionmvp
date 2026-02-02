import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  BarChart3,
  Package,
  Users,
  FileText,
} from "lucide-react";
import { useLang } from "../context/LangContext";
import Card from "../components/Card";
import Modal from "../components/Modal";

const Features = () => {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const featureIcons = [
    <BarChart3 key="analytics" size={28} />,
    <Package key="inventory" size={28} />,
    <Users key="crm" size={28} />,
    <FileText key="invoicing" size={28} />,
  ];

  const featureDetails = [
    "Track key metrics in real-time with customizable dashboards. Monitor performance, identify trends, and make data-driven decisions with confidence.",
    "Manage your entire inventory from a single platform. Track stock levels, set reorder points, and automate ordering to never run out of critical items.",
    "Build stronger customer relationships with detailed contact management, purchase history tracking, and automated follow-ups.",
    "Create professional invoices in seconds and send them automatically. Track payments, set reminders, and integrate with your accounting software.",
  ];

  return (
    <section className="section bg-[var(--bg-secondary)]">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            {t.features.title}
          </motion.h2>
          <p className="text-xl">{t.features.subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32 max-w-5xl mx-auto">
          {t.features.list.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                icon={featureIcons[index]}
                title={feature.title}
                description={feature.desc}
                variant="interactive"
                onClick={() =>
                  setSelectedFeature({
                    ...feature,
                    index,
                    details: featureDetails[index],
                  })
                }
              />
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            {t.features.faqTitle}
          </h3>

          <div className="flex flex-col gap-3">
            {t.features.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-lg">{faq.q}</span>
                  {openIndex === index ? (
                    <ChevronUp className="text-[var(--text-secondary)]" />
                  ) : (
                    <ChevronDown className="text-[var(--text-secondary)]" />
                  )}
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[var(--text-secondary)]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Detail Modal */}
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title={selectedFeature?.title}
        >
          {selectedFeature && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-[var(--accent-color)] mt-1">
                  {featureIcons[selectedFeature.index]}
                </div>
                <div>
                  <p className="text-base leading-relaxed mb-4">
                    {selectedFeature.desc}
                  </p>
                  <p className="text-base leading-relaxed">
                    {selectedFeature.details}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-primary w-full mt-6"
                onClick={() => setSelectedFeature(null)}
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default Features;
