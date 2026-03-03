import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Home from './views/Home';
import Admin from './views/Admin';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setIsAdmin={setIsAdmin} />} />
        <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
        <Route path="/home" element={<Home />} />
        <Route 
          path="/admin" 
          element={isAdmin ? <Admin /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
/*import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
        <Route path="/admin" element={isAdmin ? <Admin /> : <Home isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;*/