import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import {
  CssBaseline,
  ThemeProvider as MaterialThemeProvider
} from '@material-ui/core'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import theme from './assets/theme'

ReactDOM.render(
  <React.StrictMode>
    <MaterialThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <App />
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
