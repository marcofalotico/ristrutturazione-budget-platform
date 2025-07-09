import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import InserisciCategoria from './pages/InserisciCategoria'
import InserisciSpesa from './pages/InserisciSpesa'
import MyNavbar from './components/Navbar'
import Grafici from './pages/Grafici'
import ElencoCategorie from './pages/ElencoCategorie'
import Login from './components/Login';



function App() {
  return (
    <BrowserRouter>
      <MyNavbar /> {/* ✅ Navbar visibile su tutte le pagine */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inserisci" element={<InserisciCategoria />} />
        <Route path="/spesa" element={<InserisciSpesa />} />
        <Route path="/grafici" element={<Grafici />} />
        <Route path="/elenco" element={<ElencoCategorie />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
