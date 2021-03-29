import { configureStore } from '@reduxjs/toolkit'
import {
  useSelector as rawUseSelector,
  useDispatch as rawUseDispatch,
  TypedUseSelectorHook
} from 'react-redux'
import authReducer from './auth/authSlice'
import documentInfoReducer from './documentInfo/documentInfoSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    documentInfo: documentInfoReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDispatch = () => rawUseDispatch<AppDispatch>()
export default store
