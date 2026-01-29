import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const LangContext = createContext();

const translations = {
  en: {
    hero: {
      title: "Manage Your Business",
      subtitle:
        "The all-in-one solution for your daily operations. Optimize workflows and boost productivity.",
      cta: "Get Started",
      contact: "Contact Us",
    },
    nav: {
      home: "Home",
      features: "Features",
      pricing: "Pricing",
      contact: "Contact",
    },
    features: {
      title: "Powerful Features",
      subtitle: "Everything you need to succeed.",
      list: [
        {
          title: "Real-time Analytics",
          desc: "Monitor your performance with live dashboards and reports.",
        },
        {
          title: "Inventory Management",
          desc: "Track stock levels, orders, and deliveries in on place.",
        },
        {
          title: "Client CRM",
          desc: "Keep detailed records of your clients and their purchase history.",
        },
        {
          title: "Automated Invoicing",
          desc: "Generate and send invoices automatically to save time.",
        },
      ],
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "Is there a free trial?",
          a: "Yes, we offer a 14-day free trial for all plans.",
        },
        {
          q: "Can I cancel anytime?",
          a: "Absolutely. There are no long-term contracts.",
        },
        {
          q: "Do you offer support?",
          a: "We provide 24/7 customer support via email and chat.",
        },
      ],
    },
    pricing: {
      title: "Simple Pricing",
      subtitle: "Choose the plan that fits your needs.",
      plans: [
        {
          name: "Starter",
          price: "$29",
          features: ["Basic Analytics", "up to 1,000 Clients", "Email Support"],
        },
        {
          name: "Pro",
          price: "$79",
          features: [
            "Advanced Analytics",
            "Unlimited Clients",
            "Priority Support",
            "API Access",
          ],
          recommended: true,
        },
        {
          name: "Enterprise",
          price: "$199",
          features: [
            "Custom Solutions",
            "Dedicated Account Manager",
            "SLA",
            "On-premise",
          ],
        },
      ],
      subscribe: "Subscribe Now",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you.",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send Message",
    },
  },
  es: {
    hero: {
      title: "Gestiona Tu Negocio",
      subtitle:
        "La solución completa para tus operaciones diarias. Optimiza flujos y aumenta la productividad.",
      cta: "Comenzar",
      contact: "Contáctanos",
    },
    nav: {
      home: "Inicio",
      features: "Funcionalidades",
      pricing: "Precios",
      contact: "Contacto",
    },
    features: {
      title: "Funcionalidades Potentes",
      subtitle: "Todo lo que necesitas para triunfar.",
      list: [
        {
          title: "Analíticas en Tiempo Real",
          desc: "Monitorea tu rendimiento con paneles y reportes en vivo.",
        },
        {
          title: "Gestión de Inventario",
          desc: "Rastrea niveles de stock, pedidos y entregas en un solo lugar.",
        },
        {
          title: "CRM de Clientes",
          desc: "Mantén registros detallados de tus clientes y su historial.",
        },
        {
          title: "Facturación Automatizada",
          desc: "Genera y envía facturas automáticamente para ahorrar tiempo.",
        },
      ],
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          q: "¿Hay prueba gratuita?",
          a: "Sí, ofrecemos una prueba de 14 días en todos los planes.",
        },
        {
          q: "¿Puedo cancelar cuando sea?",
          a: "Absolutamente. No hay contratos a largo plazo.",
        },
        {
          q: "¿Ofrecen soporte?",
          a: "Proveemos soporte 24/7 vía correo y chat.",
        },
      ],
    },
    pricing: {
      title: "Precios Simples",
      subtitle: "Elige el plan que se adapte a ti.",
      plans: [
        {
          name: "Inicial",
          price: "$29",
          features: [
            "Analíticas Básicas",
            "Hasta 1,000 Clientes",
            "Soporte por Email",
          ],
        },
        {
          name: "Pro",
          price: "$79",
          features: [
            "Analíticas Avanzadas",
            "Clientes Ilimitados",
            "Soporte Prioritario",
            "Acceso API",
          ],
          recommended: true,
        },
        {
          name: "Empresarial",
          price: "$199",
          features: [
            "Soluciones a Medida",
            "Gerente de Cuenta",
            "SLA",
            "On-premise",
          ],
        },
      ],
      subscribe: "Suscribirse Ahora",
    },
    contact: {
      title: "Contáctanos",
      subtitle: "Nos encantaría escucharte.",
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      submit: "Enviar Mensaje",
    },
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState("en");

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

LangProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLang = () => useContext(LangContext);
