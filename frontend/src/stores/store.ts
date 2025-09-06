import { configureStore } from '@reduxjs/toolkit'
import charactersReducer from '../features/characters/charactersSlice'
import analyticsReducer from '../features/analytics/analyticsSlice'

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    analytics: analyticsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch