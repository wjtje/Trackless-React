// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, TextField } from '@material-ui/core'
import { authHeader, serverUrl } from '../../../global'
import $ from 'jquery'
import { useSnackbar } from 'notistack'
import language from '../../../language'

const l = language.editUserDialog
const lg = language.global

export default function EditUser (props: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  userInfo: {
    firstname: string;
    lastname: string;
  }
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { enqueueSnackbar } = useSnackbar()

  // States for the inputs
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    setFirstName(props.userInfo.firstname)
    setLastName(props.userInfo.lastname)
  }, [props.userInfo.firstname, props.userInfo.lastname])

  // Event handlers
  const onSave = () => {
    props.onClose()

    $.ajax({
      url: `${serverUrl}/user/~`,
      method: 'patch',
      headers: {
        ...authHeader
      },
      data: {
        firstname: firstName,
        lastname: lastName
      }
    }).done(() => {
      // Show a toast
      enqueueSnackbar(lg.saved, {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Update
      props.onSave()
    })
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>
        {l.title}
      </DialogTitle>
      <DialogContent>
        <TextField
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          label={l.firstname}
          type='text'
          margin='dense'
          fullWidth
        />

        <TextField
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          label={l.lastname}
          type='text'
          margin='dense'
          fullWidth
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
