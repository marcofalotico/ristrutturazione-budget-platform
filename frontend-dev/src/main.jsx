import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './app.css' // oppure './App.css' se si chiama così


// 🎯 Importa Redux Provider
import { Provider } from 'react-redux'
import { store } from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Rende lo store accessibile a tutta l'app */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
