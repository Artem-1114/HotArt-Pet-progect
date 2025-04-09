import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home/Home";
import Contacts from "./pages/Home/Contacts";
import About from "./pages/Home/About";
import Categories from "./pages/Home/Categories";
import CategoryPage from "./pages/Home/CategoryPage";
import AdminPanel from "../src/components/AdminPanel";
import { useState } from "react";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./components/AuthContext";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <>
      <Header onLoginClick={() => setIsAuthModalOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

export default App;