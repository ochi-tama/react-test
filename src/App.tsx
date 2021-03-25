import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { auth } from './common/firebase/firebaseClient'
import Layout from './components/Layout/Layout'
import Document from './pages/Document/Document'
import Login from './pages/Login/Login'
import Search from './pages/Search/Search'
import Top from './pages/Top/Top'
import { setUserId, fetchUserInfoWithLogin } from './redux/auth/authSlice'
import { useSelector, useDispatch } from './redux/store'

function App(): JSX.Element {
  const dispatch = useDispatch()
  React.useEffect(() => {
    // TODO: onAuthStateChangedも含めてReduxに移行する(現状断念)
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUserId(user.uid))
        dispatch(fetchUserInfoWithLogin())
      }
    })
  }, [])
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
