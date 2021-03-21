import firebase from 'firebase/app'
import 'firebase/firestore'
export type User = {
  name?: string
  email?: string
  role: string
  affilication?: string | null
  photoURL?: string | null
  workspaces?: string[] | null // workspaceのID Referenceは一旦使わない
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
  lastLoginDate: firebase.firestore.Timestamp
  // lastLoginIP?: string
  // changelog {} //更新ログを残す場合
}

export type UserData = {
  name?: string
  email?: string
  role: string
  affilication?: string | null
  photoURL?: string | null
  workspaces?: string[] | null // workspaceのID Referenceは一旦使わない
  createdAt: string
  updatedAt: string
  lastLoginDate: string
  // lastLoginIP?: string
  // changelog {} //更新ログを残す場合
}
