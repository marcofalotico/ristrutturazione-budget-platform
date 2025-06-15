import { configureStore } from '@reduxjs/toolkit'
import budgetReducer from './budgetSlice'

// 🎯 Questo è lo store globale Redux.
// Qui colleghiamo tutti gli "slice" della nostra app (per ora solo budget).
export const store = configureStore({
  reducer: {
    budget: budgetReducer
  }
})
