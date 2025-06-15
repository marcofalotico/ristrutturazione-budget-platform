import { createSlice } from '@reduxjs/toolkit'

// ✅ Stato iniziale vuoto (ora i dati arrivano dal backend)
const initialState = {
  categorie: [],             // Viene popolato da fetchCategorieAPI()
  totaleStimato: 0,
  totaleEffettivo: 0,
  scostamento: 0,
  completamento: 0
}

// ✅ Slice Redux per il budget
const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    // ✅ Azione per impostare le categorie ricevute dal backend
    setCategorie: (state, action) => {
      state.categorie = action.payload
      aggiornaTotali(state) // ogni volta che aggiorni categorie, ricalcoli tutto
    }
  }
})

// ✅ Funzione locale per calcolare i totali
function aggiornaTotali(state) {
  state.totaleStimato = state.categorie.reduce((sum, c) => sum + c.costo_max, 0)
  state.totaleEffettivo = state.categorie.reduce((sum, c) => sum + (c.costo_effettivo || 0), 0)
  state.scostamento = state.totaleEffettivo - state.totaleStimato

  const completate = state.categorie.filter(c => c.costo_effettivo !== null).length
  state.completamento = state.categorie.length > 0
    ? Math.round((completate / state.categorie.length) * 100)
    : 0
}

// ✅ Async thunk: carica le categorie da backend
export const fetchCategorieAPI = () => async (dispatch) => {
  const res = await fetch('http://localhost:3001/api/categorie')
  const data = await res.json()
  dispatch(setCategorie(data))
}

// ✅ Async thunk: aggiunge nuova categoria nel backend
export const aggiungiCategoriaAPI = (categoria) => async (dispatch) => {
  await fetch('http://localhost:3001/api/categorie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria)
  })
  dispatch(fetchCategorieAPI())
}

// ✅ Async thunk: aggiorna il costo effettivo in backend
export const aggiornaEffettivoAPI = (id, costo_effettivo) => async (dispatch) => {
  await fetch(`http://localhost:3001/api/categorie/${id}/effettivo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ costo_effettivo })
  })
  dispatch(fetchCategorieAPI())
}

// ✅ Aggiorna una categoria esistente (PUT)
export const modificaCategoriaAPI = (categoria) => async (dispatch) => {
  await fetch(`http://localhost:3001/api/categorie/${categoria.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: categoria.nome,
      costo_max: categoria.costo_max,
      macro_area: categoria.macro_area,
      note: categoria.note
    })
  })
  dispatch(fetchCategorieAPI()) // ricarica tutte le categorie
}


// ✅ Azioni da esportare
export const { setCategorie } = budgetSlice.actions
export default budgetSlice.reducer

/* ❌ VERSIONE MOCKATA — sostituita dal backend
const initialState = {
  categorie: [
    { nome: "Opere Edili", stimato: 20000, effettivo: 18000 },
    { nome: "Pavimenti", stimato: 2500, effettivo: 3000 },
    { nome: "Arredamento", stimato: 5000, effettivo: 3500 }
  ],
  totaleStimato: 27500,
  totaleEffettivo: 24500,
  scostamento: -3000,
  completamento: 89
}
*/
