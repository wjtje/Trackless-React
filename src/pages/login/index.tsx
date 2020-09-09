// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Container, Avatar, Typography, TextField, Button, CircularProgress } from '@material-ui/core'
import useStyles from './useStyles'
import { Lock } from '@material-ui/icons'
import { serverUrl } from '../../global'
import $ from 'jquery'
import language from '../../language'

const l = language.loginPage

export default function TodayPage () {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)

  const singIn = () => {
    // Get the data
    const username = ($('#username')[0] as HTMLInputElement).value
    const password = ($('#password')[0] as HTMLInputElement).value
    const deviceName = ($('#devicename')[0] as HTMLInputElement).value

    setLoading(true)

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
    }).fail(() => {
      setLoading(false)
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
          id='username'
          label={l.username}
          name='username'
          autoFocus
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
          required
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
