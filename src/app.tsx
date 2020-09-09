// Copyright (c) 2020 Wouter van der Wal

import React, { createRef } from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import RootElement from './components/root'
import { ThemeProvider, CssBaseline, Button } from '@material-ui/core'
import useTheme from './theme'
import { SnackbarProvider } from 'notistack'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { pickersLocale, momentLocale } from './global'
import moment from 'moment'
import language from './language'

// Set the moment locale
moment.locale(momentLocale)

// Create the app
function App () {
  const theme = useTheme()

  const notistackRef = createRef() as any

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          preventDuplicate
          ref={notistackRef}
          action={(key) => (
            <Button
              onClick={() => {
                notistackRef.current.closeSnackbar(key)
              }}
            >
              {language.global.btnClose}
            </Button>
          )}
        >
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
