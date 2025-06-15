import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import InserisciCategoria from './pages/InserisciCategoria'
import Grafici from './pages/Grafici'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inserisci" element={<InserisciCategoria />} />
        <Route path="/grafici" element={<Grafici />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App