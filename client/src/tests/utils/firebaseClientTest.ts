/* eslint-disable no-console */
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import config from '../../common/firebase/config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.firestore()
const storage = firebase.storage()
const auth = firebase.auth()
if (process.env.REACT_APP_EMULATOR == 'true') {
  const ip = process.env.REACT_APP_TEST_IP as string
  auth.useEmulator(`${ip}:9099`)
  db.useEmulator(ip, 8080)
}
export { auth, db, storage }
export default firebase
