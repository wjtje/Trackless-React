// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import RootElement from './components/root'
import { ThemeProvider } from '@material-ui/core'
import theme from './theme'
import { SnackbarProvider } from 'notistack'

// Create the app
function App () {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <RootElement />
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  )
}

// Render the app
render(<App />, document.getElementById('root'))
