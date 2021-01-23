import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Login from './pages/Login/Login'
import Search from './pages/Search/Search'

function App(): JSX.Element {
  return (
    <RootDiv>
      <header className="App-header"></header>
      <Switch>
        <Route exact path="/" component={Search} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </RootDiv>
  )
}

export default App

const RootDiv = styled.div`
  display: flex;
`
