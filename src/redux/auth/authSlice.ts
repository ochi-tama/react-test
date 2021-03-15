import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { db } from '../../common/firebase/firebaseClient'
import { User } from '../../schema/user'
import { RootState } from './../store'

type UserState = {
  loading: boolean
  user: User | undefined
  uid: string | undefined
  errors: Record<string, string>
}

const initialState: UserState = {
  loading: false,
  user: undefined,
  uid: undefined,
  errors: {}
}

export const fetchUserInfoWithLogin = createAsyncThunk<
  User,
  void,
  { state: RootState }
>('users/fetchByLogin', async (_, thunkApi) => {
  const uid = thunkApi.getState().auth.uid
  const doc = await db.collection('users').doc(uid).get()
  const data = doc.data() as User
  return data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.uid = action.payload
    },
    logout: (state) => {
      state.uid = undefined
      state.user = undefined
      state.errors = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfoWithLogin.pending, (state) => {
      return {
        ...state,
        loading: true
      }
    })
    builder.addCase(fetchUserInfoWithLogin.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        user: action.payload
      }
    })
    builder.addCase(fetchUserInfoWithLogin.rejected, (state) => {
      const errors = state.errors
      errors['login'] = 'ユーザー情報の取得に失敗'
      return {
        ...state,
        errors: errors
      }
    })
  }
})

const { reducer, actions } = authSlice
export const { setUserId, logout } = actions
export default reducer
