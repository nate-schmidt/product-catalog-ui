import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Checkout from "./Checkout";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <h1 className="text-6xl font-bold text-white mb-4">Hello World! 👋</h1>
      <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
        One day I hope to be an ecommerce website.
      </p>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
        <header className="mb-8">
          <nav className="flex items-center justify-center gap-4">
            <Link to="/" className="text-white underline">
              Home
            </Link>
            <Link to="/checkout" className="text-white underline">
              Checkout
            </Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
