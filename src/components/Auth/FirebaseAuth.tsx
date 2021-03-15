/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
// Import FirebaseAuth and firebase.
import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase, { auth } from '../../common/firebase/firebaseClient'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { AuthContext } from '../../context/AuthContext'
import {
  Container,
  Paper,
  Grid,
  Box,
  Typography,
  Divider
} from '@material-ui/core'
import firebaseui from 'firebaseui'
import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import './Auth.css'
import { useDispatch, useSelector } from '../../redux/store'
import { fetchUserInfoWithLogin, setUserId } from '../../redux/auth/authSlice'

// Configure FirebaseUI.
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

function FirebaseAuth(): JSX.Element {
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        // ログイン成功時にauthcontextに保存する
        // https://firebase.google.com/docs/reference/android/com/google/firebase/auth/AuthResult
        const user = authResult.user as firebase.User
        dispatch(setUserId(user.uid))
        dispatch(fetchUserInfoWithLogin())
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        // 今の実装でtrueにするとトップページが2重更新される
        // React Route -> Redirect
        return false
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        const loader = document.getElementById('loader')
        if (loader) {
          loader.style.display = 'none'
        }
      }
    },
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: 'select_account'
        }
      }
    ]
  }

  const classes = useStyles()
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Box width="100%">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          <Typography component="h5" variant="h5" align="center">
            or
          </Typography>
        </Box>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
export default FirebaseAuth

const LoginPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(2)};
  align-items: center;
  color: ${(props) => props.theme.palette.text.secondary};
  min-width: 30vw;
  height: 50vh;
`

const CenterGrid = styled(Grid)`
  min-height: 100vh;
`
/**
      <CenterGrid>
      <Grid container alignItems="center" justify="center">
      <Grid item xs={6} sm={4}>
      <CenterGrid container direction="column" justify="center">
            <LoginPaper>
            <Grid item xs={12}>
                <Typography variant="h3" align="center">
                Please Login
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                </Grid>
                </LoginPaper>
          </CenterGrid>
          </Grid>
          </Grid>
          </CenterGrid>
        */
