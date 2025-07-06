// ✅ Import Redux Toolkit
import { createSlice } from '@reduxjs/toolkit'

// ✅ Leggi URL backend dall'env Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ✅ Stato iniziale
const initialState = {
  categorie: [],
  totaleStimato: 0,
  totaleEffettivo: 0,
  scostamento: 0,
  completamento: 0
}

// ✅ Slice Redux
const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setCategorie: (state, action) => {
      state.categorie = action.payload
      aggiornaTotali(state)
    }
  }
})

// ✅ Funzione per calcolare i totali
function aggiornaTotali(state) {
  state.totaleStimato = state.categorie.reduce((sum, c) => sum + c.costo_max, 0)
  state.totaleEffettivo = state.categorie.reduce((sum, c) => sum + (c.costo_effettivo || 0), 0)
  state.scostamento = state.totaleEffettivo - state.totaleStimato

  const completate = state.categorie.filter(c => c.costo_effettivo !== null).length
  state.completamento = state.categorie.length > 0
    ? Math.round((completate / state.categorie.length) * 100)
    : 0
}

// ✅ Async thunk: carica categorie
export const fetchCategorieAPI = () => async (dispatch) => {
  const res = await fetch(`${API_URL}/api/categorie`)
  const data = await res.json()
  dispatch(setCategorie(data))
}

// ✅ Async thunk: aggiungi categoria
export const aggiungiCategoriaAPI = (categoria) => async (dispatch) => {
  await fetch(`${API_URL}/api/categorie`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria)
  })
  dispatch(fetchCategorieAPI())
}

// ✅ Async thunk: aggiorna solo costo_effettivo
export const aggiornaEffettivoAPI = (id, costo_effettivo) => async (dispatch) => {
  await fetch(`${API_URL}/api/categorie/${id}/effettivo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ costo_effettivo })
  })
  dispatch(fetchCategorieAPI())
}

// ✅ Async thunk: modifica intera categoria
export const modificaCategoriaAPI = (categoria) => async (dispatch) => {
  await fetch(`${API_URL}/api/categorie/${categoria.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: categoria.nome,
      costo_max: categoria.costo_max,
      macro_area: categoria.macro_area,
      note: categoria.note,
      costo_effettivo: categoria.costo_effettivo // se lo hai in modale
    })
  })
  dispatch(fetchCategorieAPI())
}

export const { setCategorie } = budgetSlice.actions
export default budgetSlice.reducer
