// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, TextField, Typography } from '@material-ui/core'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import $ from 'jquery'
import { Location } from '../../@types/interfaces'
import { useSnackbar } from 'notistack'
import RemoveDialog from '../RemoveDialog'

export default function LocationDialog (props: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  locationId?: number;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  // States for the inputs
  const [place, setPlace] = useState('')
  const [name, setName] = useState('')
  const [id, setId] = useState('')

  // Get work for editing
  useEffect(() => {
    if (props.locationId !== undefined && props.locationId !== 0) {
      // Get data from the server
      $.ajax({
        method: 'get',
        url: `${serverUrl}/location/${props.locationId}`,
        headers: {
          ...authHeader
        }
      }).done((data: Location[]) => {
        // Update the states
        setPlace(data[0]?.place)
        setName(data[0]?.name)
        setId(data[0]?.id)
      })
    } else {
      // Clear the inputs
      setPlace('')
      setName('')
      setId('')
    }
  }, [props.locationId])

  // Event handlers
  const onSave = () => {
    props.onClose()

    // Push data to the server
    $.ajax({
      url: (props.locationId === undefined || props.locationId === 0) ? `${serverUrl}/location` : `${serverUrl}/location/${props.locationId}`,
      method: (props.locationId === undefined || props.locationId === 0) ? 'post' : 'patch',
      headers: {
        ...authHeader
      },
      data: {
        place: place,
        name: name,
        id: id
      }
    }).done(() => {
      props.onSave()

      // Show a toast
      enqueueSnackbar('Saved!', {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Clear the inputs
      setPlace('')
      setName('')
      setId('')
    })
  }

  // Remove the item from the server
  const [open, setOpen] = useState(false)
  const onRemove = () => {
    props.onClose()

    setOpen(false)

    // Push data to the server
    $.ajax({
      url: `${serverUrl}/location/${props.locationId}`,
      method: 'delete',
      headers: {
        ...authHeader
      }
    }).done(() => {
      props.onSave()

      // Show a toast
      enqueueSnackbar('Removed!', {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Clear the inputs
      setPlace('')
      setName('')
      setId('')
    })
  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
        <DialogTitle>
          Location
        </DialogTitle>
        <DialogContent>
          <TextField
            value={place}
            onChange={e => setPlace(e.target.value)}
            label='Place'
            type='text'
            fullWidth
          />

          <TextField
            value={name}
            onChange={e => setName(e.target.value)}
            label='Name'
            type='text'
            fullWidth
            className={classes.spacing}
          />

          <TextField
            value={id}
            onChange={e => setId(e.target.value)}
            label='Id'
            type='text'
            fullWidth
            className={classes.spacing}
          />
        </DialogContent>
        <DialogActions>
          <Typography component='div' hidden={props.locationId === undefined || props.locationId === 0}>
            <Button color='secondary' onClick={() => { setOpen(true) }}>
              Remove
            </Button>
          </Typography>
          <Button color='primary' onClick={onSave}>
            Save
          </Button>
          <Button color='primary' onClick={props.onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <RemoveDialog open={open} onClose={() => { setOpen(false) }} onRemove={onRemove} />
    </div>
  )
}
