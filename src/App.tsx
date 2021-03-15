import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Layout from './components/Layout/Layout'
import Document from './pages/Document/Document'
import Login from './pages/Login/Login'
import Search from './pages/Search/Search'
import Top from './pages/Top/Top'
import { useSelector } from './redux/store'

function App(): JSX.Element {
  const currentUser = useSelector((state) => state.auth.user)
  return (
    <Switch>
      <Route exact path="/login">
        {!!currentUser ? <Redirect to="/" /> : <Login />}
      </Route>
      <RootDiv>
        <Layout authenticated={!!currentUser}>
          <Switch>
            <Route exact path="/search" component={Search} />
            <Route exact path="/documents" component={Document} />
            <Route component={Top} />
          </Switch>
        </Layout>
      </RootDiv>
    </Switch>
  )
}

export default App

const RootDiv = styled.div`
  display: flex;
`
