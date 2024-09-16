import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import "./App.css";

import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <header><Navbar /></header>
      <main> 
        <Router>
            
            
            <Routes>
                <Route exact path="/" element={<ListadoEventos />} />
                <Route exact path="/login" element={<InicioSesion />} />
                <Route exact path="/register" element={<Registro />} />
            </Routes>   
        </Router>
        </main>
        <footer>@copy 2024</footer>
    </AuthProvider>
  );
}

export default App;
