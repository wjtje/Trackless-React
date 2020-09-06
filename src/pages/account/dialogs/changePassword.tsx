// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, TextField, DialogContentText } from '@material-ui/core'
import { authHeader, serverUrl } from '../../../global'
import $ from 'jquery'
import { useSnackbar } from 'notistack'
import language from '../../../language'

const l = language.changePasswordDialog
const lg = language.global

export default function ChangePassword (props: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
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
        enqueueSnackbar(lg.saved, {
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
        {l.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {l.content}
        </DialogContentText>
        <TextField
          value={firstPassword}
          onChange={e => setFirstPassword(e.target.value)}
          label={l.password}
          type='password'
          margin='dense'
          fullWidth
        />

        <TextField
          value={secondPassword}
          onChange={e => setSecondPassword(e.target.value)}
          label={l.rePassword}
          type='password'
          margin='dense'
          fullWidth
          error={firstPassword !== secondPassword && secondPassword !== ''}
        />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={onSave}>
          {lg.btnSave}
        </Button>
        <Button color='primary' onClick={props.onClose}>
          {lg.btnClose}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
