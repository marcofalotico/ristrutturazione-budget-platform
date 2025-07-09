// ✅ Import base Redux Toolkit + Supabase client
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../SupabaseClient'

// ✅ Stato iniziale
const initialState = {
  categorie: [],
  totaleStimato: 0,
  totaleEffettivo: 0,
  scostamento: 0,
  completamento: 0
}

/* ----------------- Async Thunks ----------------- */

// ✅ [GET] Tutte le categorie (solo utente loggato)
export const fetchCategorieAPI = createAsyncThunk(
  'budget/fetchCategorieAPI',
  async (_, thunkAPI) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utente non autenticato')

    const { data, error } = await supabase
      .from('categorie')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error
    return data
  }
)

// ✅ [POST] Aggiungi categoria
export const aggiungiCategoriaAPI = createAsyncThunk(
  'budget/aggiungiCategoriaAPI',
  async (categoria, thunkAPI) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utente non autenticato')

    const { data, error } = await supabase
      .from('categorie')
      .insert([{ ...categoria, user_id: user.id }])
      .select()

    if (error) throw error
    return data[0] // Torna la riga inserita
  }
)

// ✅ [PUT] Modifica categoria completa
export const modificaCategoriaAPI = createAsyncThunk(
  'budget/modificaCategoriaAPI',
  async (categoria, thunkAPI) => {
    const { id, ...fields } = categoria

    const { data, error } = await supabase
      .from('categorie')
      .update(fields)
      .eq('id', id)
      .select('*')

    if (error) throw error
    return data[0] // Torna la riga aggiornata
  }
)

/* ----------------- Slice Redux ----------------- */

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorieAPI.fulfilled, (state, action) => {
        state.categorie = action.payload
        aggiornaTotali(state)
      })
      .addCase(aggiungiCategoriaAPI.fulfilled, (state, action) => {
        state.categorie.push(action.payload)
        aggiornaTotali(state)
      })
      .addCase(modificaCategoriaAPI.fulfilled, (state, action) => {
        const index = state.categorie.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.categorie[index] = action.payload
        }
        aggiornaTotali(state)
      })
  }
})

// ✅ Funzione per aggiornare i totali globali
function aggiornaTotali(state) {
  state.totaleStimato = state.categorie.reduce((sum, c) => sum + c.costo_max, 0)
  state.totaleEffettivo = state.categorie.reduce((sum, c) => sum + (c.costo_effettivo || 0), 0)
  state.scostamento = state.totaleEffettivo - state.totaleStimato

  const completate = state.categorie.filter(c => c.costo_effettivo !== null && c.costo_effettivo !== undefined).length
  state.completamento = state.categorie.length > 0
    ? Math.round((completate / state.categorie.length) * 100)
    : 0
}

export default budgetSlice.reducer
