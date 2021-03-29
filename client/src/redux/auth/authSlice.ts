/* eslint-disable no-console */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { auth, db } from '../../common/firebase/firebaseClient'
import { User } from '../../schema/user'
import { UserData } from '../../schema/user'
import { RootState } from '../store'

type UserState = {
  loading: boolean
  user: UserData | undefined
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
  UserData,
  void,
  { state: RootState }
>('users/fetchByLogin', async (_, thunkApi) => {
  const uid = thunkApi.getState().auth.uid
  const doc = await db.collection('users').doc(uid).get()
  const data = doc.data() as User
  return {
    ...data,
    createdAt: data.createdAt.toDate().toLocaleDateString(),
    updatedAt: data.updatedAt.toDate().toLocaleDateString(),
    lastLoginDate: data.lastLoginDate.toDate().toLocaleDateString()
  }
})

export const logout = createAsyncThunk('users/logout', async () => {
  await auth.signOut()
  return {}
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
    builder.addCase(logout.pending, (state) => {
      return {
        ...state,
        loading: true
      }
    })
    builder.addCase(logout.fulfilled, (state) => {
      return {
        ...state,
        loading: false,
        uid: undefined,
        user: undefined,
        errors: {}
      }
    })
  }
})

const { reducer, actions } = authSlice
export const { setUserId } = actions
export default reducer
