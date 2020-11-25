// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import AppBar from '../appBar'
import TodayPage from '../../pages/today'
import { useSnackbar } from 'notistack'
import { Switch, Route } from 'react-router-dom'
import SettingsPage from '../../pages/settings'
import AccountPage from '../../pages/account'
import ThisWeekPage from '../../pages/thisWeek'
import LocationPage from '../../pages/location'
import LoginPage from '../../pages/login'
import UserPage from '../../pages/user'
import ExportPage from '../../pages/export'
import HistoryPage from '../../pages/history'
import $ from 'jquery'
import language from '../../language'
import { version } from '../../global'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

const l = language.root

export default function RootElement () {
  const { enqueueSnackbar } = useSnackbar()

  // Check if there is any stored data
  if (
    window.localStorage.getItem('apiKey') == null ||
    window.localStorage.getItem('serverUrl') == null ||
    window.localStorage.getItem('apiKey') === '' ||
    window.localStorage.getItem('serverUrl') === ''
  ) {
    // TOOD: Clear all the local caches
    // Make sure you are on the login page
    if (window.location.href.split('/')[window.location.href.split('/').length - 1] !== 'login') {
      window.location.href = '/login'
    }
  } else {
    // Go to the home page
    if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'login') {
      window.location.href = '/'
    }

    // Load the basic user infomation
    // TODO: load user details
    // TODO: load user access
  }

  // Define global error
  $(document).ajaxError((event, xhr) => {
    if (xhr.responseJSON?.code === 'trackless.location.removeFailed') {
      // Location in use
      enqueueSnackbar(l.canNotRemove, {
        variant: 'info',
        autoHideDuration: 5000
      })
    } else if (xhr.responseJSON?.code === 'trackless.auth.user.notFound' && window.localStorage.getItem('apiKey') !== '') {
      // Wrong api key
      window.localStorage.setItem('apiKey', '')
      window.location.href = '/login'
    } else {
      // Do not print error's on login screen
      if (window.location.href.split('/')[window.location.href.split('/').length - 1] !== 'login') {
        enqueueSnackbar(`${l.connectionError} (${xhr.responseJSON?.code || l.errorUndef})`, {
          variant: 'error',
          autoHideDuration: 10000
        })
      }
    }
  })

  // States for update dialog
  const [open, setOpen] = useState((window.localStorage.getItem('lastVersion') !== version))

  return (
    <div>
      <AppBar />
      <Dialog open={open} onClose={() => { setOpen(false); window.localStorage.setItem('lastVersion', version) }}>
        <DialogTitle>Trackless is geupdated!</DialogTitle>
        <DialogContent>
          <DialogContentText>Wat is nieuw in versie {version}</DialogContentText>
          <ul>
            <li>Werknemers kunnen nu emoji gebruiken</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={() => { setOpen(false); window.localStorage.setItem('lastVersion', version) }}>
            Sluiten
          </Button>
        </DialogActions>
      </Dialog>
      <Switch>
        <Route path='/' exact component={() => <TodayPage />} />
        <Route path='/account' exact component={() => <AccountPage />} />
        <Route path='/settings' exact component={() => <SettingsPage />} />
        <Route path='/thisWeek' exact component={() => <ThisWeekPage />} />
        <Route path='/location' exact component={() => <LocationPage />} />
        <Route path='/login' exact component={() => <LoginPage />} />
        <Route path='/user' exact component={() => <UserPage />} />
        <Route path='/export' exact component={() => <ExportPage />} />
        <Route path='/history' exact component={() => <HistoryPage />} />
      </Switch>
    </div>
  )
}
