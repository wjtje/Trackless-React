// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import RootElement from './components/root'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import useTheme from './theme'
import { SnackbarProvider } from 'notistack'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { pickersLocale, momentLocale } from './global'
import moment from 'moment'

// Set the moment locale
moment.locale(momentLocale)

// Create the app
function App () {
  const theme = useTheme()

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={pickersLocale}
          >
            <RootElement />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  )
}

// Render the app
render(<App />, document.getElementById('root'))
