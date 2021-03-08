import { configureStore } from '@reduxjs/toolkit'
import {
  useSelector as rawUseSelector,
  TypedUseSelectorHook
} from 'react-redux'
import authReducer from './auth/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector
export default store
