import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LangProvider } from "./context/LangContext";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Features from "./views/Features";
import Pricing from "./views/Pricing";
import Contact from "./views/Contact";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>

            <footer className="py-8 text-center text-[var(--text-secondary)] border-t border-[var(--glass-border)]">
              <div className="container">
                <p>
                  &copy; {new Date().getFullYear()} GestionApp. All rights
                  reserved.
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
