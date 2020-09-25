// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, TextField, Typography, DialogContentText } from '@material-ui/core'
import { serverUrl, authHeader } from '../../global'
import $ from 'jquery'
import { Location } from '../../@types/interfaces'
import { useSnackbar } from 'notistack'
import RemoveDialog from '../RemoveDialog'
import language from '../../language'

const l = language.locationDialog
const lg = language.global

export default function LocationDialog (props: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editLocation?: Location;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { enqueueSnackbar } = useSnackbar()

  // States for the inputs
  const [place, setPlace] = useState('')
  const [name, setName] = useState('')
  const [id, setId] = useState('')

  // Other states
  const [open, setOpen] = useState(false)

  // Get work for editing
  useEffect(() => {
    // Clear the inputs
    clearStates()

    // Update the states
    if (props.editLocation?.locationID != null && props.editLocation?.locationID !== 0) {
      setPlace(props.editLocation?.place)
      setName(props.editLocation?.name)
      setId(props.editLocation?.id)
    }
  }, [props.editLocation])

  // Event handlers
  const onSave = () => {
    props.onClose()

    // Push data to the server
    // Check if we need to post or patch
    $.ajax({
      url: (props.editLocation?.locationID === undefined || props.editLocation?.locationID === 0) ? `${serverUrl}/location` : `${serverUrl}/location/${props.editLocation?.locationID}`,
      method: (props.editLocation?.locationID === undefined || props.editLocation?.locationID === 0) ? 'post' : 'patch',
      headers: {
        ...authHeader
      },
      data: {
        place: place,
        name: name,
        id: id
      }
    }).done(() => {
      // Show a toast
      enqueueSnackbar(lg.saved, {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Reload
      props.onSave()
    })
  }

  const onRemove = () => {
    // Close all the dialogs
    props.onClose()
    setOpen(false)

    // Clear all the inputs
    clearStates()

    // Send the command to the server
    $.ajax({
      url: `${serverUrl}/location/${props.editLocation?.locationID}`,
      method: 'delete',
      headers: {
        ...authHeader
      }
    }).done(() => {
      // Show a toast
      enqueueSnackbar(lg.removed, {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Reload
      props.onSave()
    })
  }

  const onHide = () => {
    // Close the dialog
    props.onClose()

    // Toggle the hidden state
    $.ajax({
      url: `${serverUrl}/location/${props.editLocation?.locationID}`,
      method: 'patch',
      headers: {
        ...authHeader
      },
      data: {
        hidden: Number(!props.editLocation?.hidden)
      }
    }).done(() => {
      // Show a toast
      enqueueSnackbar(lg.saved, {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Reload
      props.onSave()
    })
  }

  // Check if edit mode is on
  const editMode = props.editLocation?.locationID != null && props.editLocation?.locationID !== 0

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
        <DialogTitle>
          {(editMode) ? l.titleEdit : l.titleAdd}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(editMode) ? l.contentEdit : l.contentAdd}
          </DialogContentText>
          <TextField
            value={place}
            onChange={e => setPlace(e.target.value)}
            label={l.place}
            type='text'
            margin='dense'
            fullWidth
          />

          <TextField
            value={name}
            onChange={e => setName(e.target.value)}
            label={l.name}
            type='text'
            margin='dense'
            fullWidth
          />

          <TextField
            value={id}
            onChange={e => setId(e.target.value)}
            label={l.id}
            type='text'
            margin='dense'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Typography component='div' hidden={!editMode}>
            <Button color='primary' onClick={onHide}>
              {(props.editLocation?.hidden) ? lg.btnShow : lg.btnHide}
            </Button>
          </Typography>
          <Typography component='div' hidden={!editMode}>
            <Button color='secondary' onClick={() => { setOpen(true) }}>
              {lg.btnRemove}
            </Button>
          </Typography>
          <Button color='primary' onClick={onSave}>
            {lg.btnSave}
          </Button>
          <Button color='primary' onClick={props.onClose}>
            {lg.btnClose}
          </Button>
        </DialogActions>
      </Dialog>

      <RemoveDialog open={open} onClose={() => { setOpen(false) }} onRemove={onRemove} />
    </div>
  )

  // Clear all the states
  function clearStates () {
    setPlace('')
    setName('')
    setId('')
  }
}
