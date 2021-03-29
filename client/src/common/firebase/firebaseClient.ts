/* eslint-disable no-console */
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import config from './config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.firestore()
const storage = firebase.storage()
const auth = firebase.auth()

if (
  location.hostname === 'localhost' &&
  process.env.REACT_APP_EMULATOR === 'true'
) {
  auth.useEmulator('http://localhost:9099')
  db.useEmulator('localhost', 8080)
}
export { auth, db, storage }
export default firebase
