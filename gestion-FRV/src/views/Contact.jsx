import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useLang } from "../context/LangContext";

const Contact = () => {
  const { t } = useLang();

  const contactInfo = [
    { icon: <Mail size={20} />, text: "hello@gestionapp.com" },
    { icon: <Phone size={20} />, text: "+1 (555) 123-4567" },
    { icon: <MapPin size={20} />, text: "123 Innovation Dr, Tech City" },
  ];

  return (
    <section className="section bg-[var(--bg-secondary)]">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">{t.contact.title}</h2>
            <p className="text-xl">{t.contact.subtitle}</p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
          >
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-[var(--text-secondary)]"
              >
                <div className="text-[var(--accent-color)]">{item.icon}</div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <form className="space-y-6">
              <div>
                <label htmlFor="name">{t.contact.name}</label>
                <input id="name" type="text" placeholder="John Doe" />
              </div>

              <div>
                <label htmlFor="email">{t.contact.email}</label>
                <input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div>
                <label htmlFor="message">{t.contact.message}</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="button"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
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
