/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import firebase, { auth, db } from '../common/firebase/firebaseClient'

// contextの作成
type DefaultAuthContext = {
  currentUser: firebase.User | undefined | null
  setCurrentUser?: React.Dispatch<
    React.SetStateAction<firebase.User | null | undefined>
  >
  info: any
  setInfo?: React.Dispatch<any>
}

export const AuthContext = React.createContext<DefaultAuthContext>({
  currentUser: undefined,
  info: undefined
})

type Props = {
  children: JSX.Element
}

export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>()
  const [info, setInfo] = useState<any>()

  // ユーザーをログインさせる関数
  /*
  const login = async (email, password, history) => {
    try {
      await auth.signInWithEmailAndPassword(email, password)
      history.push('/')
    } catch (error) {
      alert(error)
    }
  }

  // 新しいユーザーを作成しログインさせる関数
  const signup = async (email, password, history) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      history.push('/')
    } catch (error) {
      alert(error)
    }
  }
  */

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user)
        const doc = await db.collection('users').doc(user.uid).get()
        setInfo(doc?.data())
      } else {
        console.log('not logged in')
      }
    })
  }, [])

  return (
    // Contextを使用して認証に必要な情報をコンポーネントツリーに流し込む。
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser: setCurrentUser,
        info: info,
        setInfo: setInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
