import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Shield, Zap } from "lucide-react";
import { useLang } from "../context/LangContext";

const Home = () => {
  const { t } = useLang();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section id="home" className="section relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--accent-color)] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container relative z-10 pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            {t.hero.title}
            <span className="block text-[var(--accent-color)]">
              Simple & Powerful.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-[var(--text-secondary)] mb-10 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="btn btn-primary text-lg w-full sm:w-auto hover:shadow-lg hover:shadow-orange-500/30">
              {t.hero.cta} <ArrowRight size={20} />
            </button>
            <button className="btn btn-outline text-lg w-full sm:w-auto">
              {t.hero.contact}
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Cards Demo */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Zap size={32} />,
              title: "Fast",
              desc: "Lightning quick performance.",
            },
            {
              icon: <Shield size={32} />,
              title: "Secure",
              desc: "Enterprise-grade security.",
            },
            {
              icon: <BarChart2 size={32} />,
              title: "Analytics",
              desc: "Real-time data insights.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-2xl flex flex-col items-center text-center group"
            >
              <div className="mb-4 p-4 rounded-full bg-[var(--bg-secondary)] text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-[var(--text-secondary)]">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
