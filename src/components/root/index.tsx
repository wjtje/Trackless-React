// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
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

export default function RootElement () {
  const { enqueueSnackbar } = useSnackbar()

  // Go to the login page
  if (
    window.location.href.split('/')[window.location.href.split('/').length - 1] !== 'login' &&
    window.localStorage.getItem('apiKey') === null
  ) {
    window.location.href = '/login'
  }

  // Go to the homepage
  if (
    window.location.href.split('/')[window.location.href.split('/').length - 1] === 'login' &&
    window.localStorage.getItem('apiKey') !== null
  ) {
    window.location.href = '/'
  }

  // Define global error
  $(document).ajaxError((event, xhr) => {
    enqueueSnackbar(`Connection error (${xhr.responseJSON?.code})`, {
      variant: 'error',
      autoHideDuration: 10000
    })
  })

  return (
    <div>
      <AppBar />
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
