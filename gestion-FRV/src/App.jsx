import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LangProvider } from "./context/LangContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import DashboardRoutes from "./views/localDashboard/routes";
import Home from "./views/Home";
import Features from "./views/Features";
import Pricing from "./views/Pricing";
import Contact from "./views/Contact";
import Login from "./views/Login";
import Register from "./views/Register";
import TwoFALogin from "./views/2fa-login";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Landing Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth Routes (No Navbar/Footer) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login/2fa" element={<TwoFALogin />} />

              {/* Protected Dashboard Routes */}
              {DashboardRoutes}
            </Routes>
          </AuthProvider>
        </Router>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
