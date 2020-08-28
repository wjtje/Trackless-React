// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import RootElement from './components/root'

// Create the app
function App () {
  return (
    <Router>
      <RootElement />
    </Router>
  )
}

// Render the app
render(<App />, document.getElementById('root'))
