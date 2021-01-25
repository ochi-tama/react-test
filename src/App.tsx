import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Search from './pages/Search/Search'
import Top from './pages/Top/Top'
import { AuthContext } from './context/AuthContext'

function App(): JSX.Element {
  const { currentUser } = React.useContext(AuthContext)
  return (
    <RootDiv>
      <Layout authenticated={!!currentUser}>
        <Switch>
          <Route exact path="/search" component={Search} />
          <Route exact path="/login" component={Login} />
          <Route component={Top} />
        </Switch>
      </Layout>
    </RootDiv>
  )
}

export default App

const RootDiv = styled.div`
  display: flex;
`
