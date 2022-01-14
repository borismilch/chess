import React from 'react'
import './index.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import GameApp from './GameApp'
import { auth } from './firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import UserForm from './pages/UserForm'

const App = () => {

  const [user, loading, error] = useAuthState(auth)

  if (loading) {
    return ( <p>Loading...</p> )
  }

  if (error) {
    return ( <p>Erorr...</p> )
  }

  if (!user) {
    return <UserForm />
  }

  return (
    <Router >

      <Switch>

        <Route exact path='/'>
          <Home />
        </Route>

        <Route exact path='/game/:id'>
          <GameApp />
        </Route>


      </Switch>

    </Router>
  )
}

export default App
