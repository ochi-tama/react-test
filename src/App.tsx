import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from './pages/Login/Login'
import Search from './pages/Search/Search'

function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Switch>
        <Route exact path="/" component={Search} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  )
}

export default App
