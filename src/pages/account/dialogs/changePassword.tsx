// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, TextField } from '@material-ui/core'
import useStyles from './useStyles'
import { authHeader, serverUrl } from '../../../global'
import $ from 'jquery'
import { useSnackbar } from 'notistack'

export default function ChangePassword (props: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  // States for the inputs
  const [firstPassword, setFirstPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')

  // Event handlers
  const onSave = () => {
    if (firstPassword === secondPassword) {
      props.onClose()

      $.ajax({
        url: `${serverUrl}/user/~`,
        method: 'patch',
        headers: {
          ...authHeader
        },
        data: {
          password: firstPassword
        }
      }).done(() => {
        // Show a toast
        enqueueSnackbar('Saved!', {
          variant: 'success',
          autoHideDuration: 2000
        })

        // Clear the passwords
        setFirstPassword('')
        setSecondPassword('')
      })
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>
        Change password
      </DialogTitle>
      <DialogContent>
        <TextField
          value={firstPassword}
          onChange={e => setFirstPassword(e.target.value)}
          label='Password'
          type='password'
          fullWidth
        />

        <TextField
          value={secondPassword}
          onChange={e => setSecondPassword(e.target.value)}
          label='Repeat password'
          type='password'
          fullWidth
          error={firstPassword !== secondPassword && secondPassword !== ''}
          className={classes.spacing}
        />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={onSave}>
          Save
        </Button>
        <Button color='primary' onClick={props.onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
