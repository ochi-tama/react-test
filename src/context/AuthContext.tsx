/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import firebase, { auth } from '../common/firebase/firebaseClient'

// contextの作成
type DefaultAuthContext = {
  currentUser: firebase.User | undefined
  setCurrentUser:
    | React.Dispatch<React.SetStateAction<firebase.User | undefined>>
    | undefined
}
export const AuthContext = React.createContext<DefaultAuthContext>({
  currentUser: undefined,
  setCurrentUser: undefined
})

type Props = {
  children: JSX.Element
}

export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<firebase.User>()

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
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        console.log('not logged in')
      }
    })
  }, [])

  return (
    // Contextを使用して認証に必要な情報をコンポーネントツリーに流し込む。
    <AuthContext.Provider
      value={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
