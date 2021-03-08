import React from 'react'
import { Provider } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Layout from './components/Layout/Layout'
import { AuthContext } from './context/AuthContext'
import Document from './pages/Document/Document'
import Login from './pages/Login/Login'
import Search from './pages/Search/Search'
import Top from './pages/Top/Top'
import store from './redux/store'

function App(): JSX.Element {
  const { currentUser } = React.useContext(AuthContext)
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default App

const RootDiv = styled.div`
  display: flex;
`
