import { configureStore } from '@reduxjs/toolkit'
import budgetReducer from './budgetSlice'

// 🎯 Questo è lo store globale Redux Toolkit.
// Puoi aggiungere altri slice in futuro se servono.
export const store = configureStore({
  reducer: {
    budget: budgetReducer
  }
})
