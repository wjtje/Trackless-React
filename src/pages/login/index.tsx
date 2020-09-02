// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { Container, Avatar, Typography, TextField, Button } from '@material-ui/core'
import useStyles from './useStyles'
import { Lock } from '@material-ui/icons'
import { serverUrl } from '../../global'
import { useSnackbar } from 'notistack'
import $ from 'jquery'

export default function TodayPage () {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const singIn = () => {
    // Get the data
    const username = ($('#username')[0] as HTMLInputElement).value
    const password = ($('#password')[0] as HTMLInputElement).value
    const deviceName = ($('#devicename')[0] as HTMLInputElement).value

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
      location.reload()
    }).fail((result) => {
      // Trow error
      const error = JSON.parse(result.responseText)
      enqueueSnackbar(error.message, {
        variant: 'error'
      })
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
        Sign in
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          autoFocus
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          name='password'
          label='Password'
          type='password'
          id='password'
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          name='devicename'
          label='Device name'
          id='devicename'
        />
        <Button
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
          onClick={singIn}
        >
          Sign In
        </Button>
      </form>
    </Container>
  )
}
