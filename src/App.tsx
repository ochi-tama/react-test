import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Search from './pages/Search/Search'

function App(): JSX.Element {
  return (
    <RootDiv>
      <Layout>
        <>
          <header className="App-header"></header>
          <Switch>
            <Route exact path="/" component={Search} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </>
      </Layout>
    </RootDiv>
  )
}

export default App

const RootDiv = styled.div`
  display: flex;
`
