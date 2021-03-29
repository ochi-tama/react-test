/* eslint-disable no-console */
import store from './../../redux/store'
/*
import { fetchDocumentInfo } from '../../redux/documentInfo/documentInfoSlice'
import { auth } from '../../common/firebase/firebaseClient'
import { setUserId } from '../../redux/auth/authSlice'
*/

describe('Document Reducer のテスト', () => {
  /*
  beforeAll(async () => {
    const email = process.env.REACT_APP_TEST_USER_EMAIL as string
    const password = process.env.REACT_APP_TEST_USER_PASSWORD as string
    const uid = process.env.REACT_APP_TEST_USER_UID as string

    try {
      await auth.signInWithEmailAndPassword(email, password)
    } catch (error) {
      console.log(error)
    }
    store.dispatch(setUserId(uid))
  })
  */

  test('初期状態の確認', () => {
    const {
      isFetching,
      hasMoreItems,
      rowsPerPage,
      tableData,
      snapshot,
      errors
    } = store.getState().documentInfo
    expect(isFetching).toBe(false)
    expect(hasMoreItems).toBe(true)
    expect(rowsPerPage).toEqual(10)
    expect(tableData).toEqual([])
    expect(snapshot).toBe(undefined)
    expect(errors).toEqual({})
  })
})
