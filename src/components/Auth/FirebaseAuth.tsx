/* eslint-disable no-console */
// Import FirebaseAuth and firebase.
import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase, { auth } from '../../common/firebase/firebaseClient'
import { AuthContext } from '../../context/AuthContext'
import firebaseui from 'firebaseui'

// Configure FirebaseUI.

function FirebaseAuth(): JSX.Element {
  const { setCurrentUser } = React.useContext(AuthContext)
  const uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        // ログイン成功時にauthcontextに保存する
        // https://firebase.google.com/docs/reference/android/com/google/firebase/auth/AuthResult
        const user = authResult.user as firebase.User
        if (setCurrentUser) {
          setCurrentUser(user)
        }
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true
      }
      /*
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none'
    }
    */
    },
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
  }

  return (
    <div>
      <h1>My App</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  )
}

export default FirebaseAuth
