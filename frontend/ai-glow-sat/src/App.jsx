import React, { useState } from "react";
import './App.css';
import { NavBar } from "./components/NavBar";
import "./index.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {/* Add other sections/components here */}
    </div>
  );
}

export default App;
