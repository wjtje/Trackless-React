// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, TextField } from '@material-ui/core'
import useStyles from './useStyles'
import { authHeader, serverUrl } from '../../../global'
import $ from 'jquery'
import { useSnackbar } from 'notistack'

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
  const classes = useStyles()
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
      enqueueSnackbar('Saved!', {
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
        Change password
      </DialogTitle>
      <DialogContent>
        <TextField
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          label='Firstname'
          type='text'
          fullWidth
        />

        <TextField
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          label='Lastname'
          type='text'
          fullWidth
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
