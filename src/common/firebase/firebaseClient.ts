/* eslint-disable no-console */
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import config from './config'
if (!firebase.apps.length) {
  firebase.initializeApp(config)
  console.log(firebase.app().name)
}

const db = firebase.firestore()
const storage = firebase.storage()
const auth = firebase.auth()
if (location.hostname === 'localhost') {
  db.useEmulator('localhost', 8080)
}
export { auth, db, storage }
export default firebase
