import {
  CssBaseline,
  ThemeProvider as MaterialThemeProvider
} from '@material-ui/core'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import App from './App'
import theme from './assets/theme'
import './index.css'
import reportWebVitals from './reportWebVitals'
import './common/firebase/firebaseClient'
import { AuthProvider } from './context/AuthContext'

ReactDOM.render(
  <React.StrictMode>
    <MaterialThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </StyledThemeProvider>
    </MaterialThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
