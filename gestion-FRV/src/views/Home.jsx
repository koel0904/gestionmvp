import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "../context/LangContext";
import Card from "../components/Card";

const Home = () => {
  const { t } = useLang();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const features = [
    {
      title: "Fast",
      desc: "Lightning quick performance for seamless operations.",
    },
    {
      title: "Secure",
      desc: "Enterprise-grade security protecting your data.",
    },
    {
      title: "Analytics",
      desc: "Real-time insights to drive better decisions.",
    },
  ];

  return (
    <section className="section relative">
      <div className="container">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 variants={itemVariants} className="mb-6 text-balance">
            {t.hero.title}
            <br />
            <span className="text-[var(--accent-color)]">
              Simple & Powerful.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 text-balance"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="btn btn-primary btn-lg">
              {t.hero.cta} <ArrowRight size={20} />
            </button>
            <button className="btn btn-outline btn-lg">{t.hero.contact}</button>
          </motion.div>
        </motion.div>

        {/* Feature Cards - Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              title={feature.title}
              description={feature.desc}
              variant="static"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
