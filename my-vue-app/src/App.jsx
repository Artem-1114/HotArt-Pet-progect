import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home/Home";
import Contacts from "./pages/Home/Contacts";
import About from "./pages/Home/About";
import Categories from "./pages/Home/Categories";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          {/* Можна додати інші маршрути */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;