import { setUserId, logout } from '../../redux/auth/authSlice'
import store from './../../redux/store'

describe('Auth Reducer のテスト', () => {
  test('初期状態の確認', () => {
    const { loading, uid, user, errors } = store.getState().auth
    expect(loading).toBe(false)
    expect(uid).toBe(undefined)
    expect(user).toBe(undefined)
    expect(errors).toEqual({})
  })

  test('setUserIdでuidがセットされる', () => {
    store.dispatch(setUserId('aiueo'))
    expect(store.getState().auth.uid).toBe('aiueo')
  })

  test('logoutでstateがリセットされる', async () => {
    store.dispatch(setUserId('aiueo'))
    await store.dispatch(logout())
    const { loading, uid, user, errors } = store.getState().auth
    expect(loading).toBe(false)
    expect(uid).toBe(undefined)
    expect(uid).not.toBe('aiueo')
    expect(user).toBe(undefined)
    expect(errors).toEqual({})
  })
})
