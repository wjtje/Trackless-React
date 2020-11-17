// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Container, Avatar, Typography, TextField, Button, CircularProgress } from '@material-ui/core'
import useStyles from './useStyles'
import { Lock } from '@material-ui/icons'
import $ from 'jquery'
import language from '../../language'
import { useSnackbar } from 'notistack'

const l = language.loginPage

export default function TodayPage () {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)

  // Enable snackbar support
  const { enqueueSnackbar } = useSnackbar()

  const singIn = () => {
    setLoading(true)

    // Get the data
    let serverUrl = ($('#serverUrl')[0] as HTMLInputElement).value
    const username = ($('#username')[0] as HTMLInputElement).value
    const password = ($('#password')[0] as HTMLInputElement).value
    let deviceName = ($('#devicename')[0] as HTMLInputElement).value

    // Test the serverURl
    if (!serverUrl.includes('https://') && !serverUrl.includes('http://')) {
      // Add https
      serverUrl = `https://${serverUrl}`

      console.log(`Login: New serverUrl: "${serverUrl}"`)
    }

    if (serverUrl[serverUrl.length - 1] === '/') {
      // Add /
      serverUrl = serverUrl.substring(0, serverUrl.length - 1)

      console.log(`Login: New serverUrl: "${serverUrl}"`)
    }

    // Test the deviceName
    if (deviceName === '') {
      deviceName = `${username}'s device`

      console.log(`Login: New deviceName: "${deviceName}"`)
    }

    // Send it to the server
    $.ajax({
      url: `${serverUrl}/login`,
      method: 'POST',
      data: {
        username: username,
        password: password,
        deviceName: deviceName
      }
    }).done((result) => {
      console.log(result)
      // Save api key
      localStorage.setItem('apiKey', result.bearer)
      localStorage.setItem('serverUrl', serverUrl)
      location.reload()
    }).fail(() => {
      setLoading(false)
      enqueueSnackbar(l.error)
    })
  }

  return (
    <Container
      className={classes.main + ' container'}
      maxWidth='sm'
      component='main'
    >
      <Avatar className={classes.avatar}>
        <Lock />
      </Avatar>
      <Typography
        component='h1'
        variant='h5'
      >
        {l.title}
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='serverUrl'
          label={l.serverUrl}
          name='serverUrl'
          autoFocus
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='username'
          label={l.username}
          name='username'
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          name='password'
          label={l.password}
          type='password'
          id='password'
        />
        <TextField
          variant='outlined'
          margin='normal'
          fullWidth
          name='devicename'
          label={l.deviceName}
          id='devicename'
        />
        <div>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={singIn}
          >
            {l.btn}
          </Button>
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </form>
    </Container>
  )
}
