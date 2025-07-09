// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import InserisciPreventivo from './pages/InserisciPreventivo';
import InserisciSpesa from './pages/InserisciSpesa';
import Grafici from './pages/Grafici';
import ElencoCategorie from './pages/ElencoCategorie';
import MyNavbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />

      <Routes>
        {/* ✅ PUBBLICO: Login */}
        <Route path="/login" element={<Login />} />
        {/* ✅ PUBBLICO: Registrazione */}
        <Route path="/register" element={<Register />} />


        {/* ✅ PRIVATI: tutti i protected */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/inserisci"
          element={
            <PrivateRoute>
              <InserisciPreventivo />
            </PrivateRoute>
          }
        />
        <Route
          path="/spesa"
          element={
            <PrivateRoute>
              <InserisciSpesa />
            </PrivateRoute>
          }
        />
        <Route
          path="/grafici"
          element={
            <PrivateRoute>
              <Grafici />
            </PrivateRoute>
          }
        />
        <Route
          path="/elenco"
          element={
            <PrivateRoute>
              <ElencoCategorie />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
