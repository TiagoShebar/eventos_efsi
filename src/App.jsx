import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from './components/NavBar/index.jsx';
import "./App.css";
import ListadoEventos from './views/ListadoEventos/index.jsx';
import InicioSesion from './views/InicioSesion/index.jsx';
import Registro from './views/Registro/index.jsx';
import { AuthProvider } from "./AuthContext";
import Footer from './components/Footer/index.jsx';
import DetalleEvento from './views/DetalleEvento/index.jsx';
import FormularioEvento from './views/FormularioEvento/index.jsx';

function App() {
  return (
    <AuthProvider>
      <header>
        <NavBar />
      </header>
      <main> 
        <Routes>
          <Route exact path="/" element={<ListadoEventos />} />
          <Route exact path="/login" element={<InicioSesion />} />
          <Route exact path="/register" element={<Registro />} />
          <Route exact path="/detailEvent/:id" element={<DetalleEvento/>}/>
          <Route exact path="/formularioCrearEvento" element={<FormularioEvento/>}/>
        </Routes>   
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;

