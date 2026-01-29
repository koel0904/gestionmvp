import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useLang } from "../context/LangContext";

const Contact = () => {
  const { t } = useLang();

  return (
    <section id="contact" className="section bg-[var(--bg-secondary)]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">{t.contact.title}</h2>
            <p className="text-[var(--text-secondary)] text-xl mb-10">
              {t.contact.subtitle}
            </p>

            <div className="space-y-6">
              {[
                { icon: <Mail />, text: "hello@gestionapp.com" },
                { icon: <Phone />, text: "+1 (555) 123-4567" },
                { icon: <MapPin />, text: "123 Innovation Dr, Tech City" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 text-lg">
                  <div className="p-3 bg-[var(--bg-primary)] rounded-full text-[var(--accent-color)] shadow-sm">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl shadow-xl"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--glass-border)] focus:ring-2 focus:ring-[var(--accent-color)] focus:outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--glass-border)] focus:ring-2 focus:ring-[var(--accent-color)] focus:outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.contact.message}
                </label>
                <textarea
                  rows="4"
                  className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--glass-border)] focus:ring-2 focus:ring-[var(--accent-color)] focus:outline-none transition-all"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                {t.contact.submit} <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
