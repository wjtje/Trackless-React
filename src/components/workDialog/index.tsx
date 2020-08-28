// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, Select, MenuItem, TextField, Typography } from '@material-ui/core'
import useLocation from '../../hooks/useLocation'
import DateFnsUtils from '@date-io/date-fns'
import {
  DatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import moment from 'moment'
import $ from 'jquery'
import { Location, Work } from '../../@types/interfaces'
import { useSnackbar } from 'notistack'

export default function AddWork (props: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  update?: string;
  locationId?: number;
  workId?: number;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  // Get all the locations
  const locations = useLocation()

  // States for the inputs
  const [locationId, setLocation] = useState(0)
  const [time, setTime] = useState('0')
  const [date, setDate] = useState(new Date())
  const [description, setDescription] = useState('')

  // Update last used location
  useEffect(() => {
    $.ajax({
      method: 'get',
      url: `${serverUrl}/location/user/~/last`,
      headers: {
        ...authHeader,
        updateId: props.update
      }
    }).done((data: Location[]) => {
      // Set the correct locationId
      setLocation(data[0]?.locationId)
    })
  }, [props.update])

  // Update most used location
  useEffect(() => {
    if (props.locationId !== 0 && props.locationId !== undefined) {
      setLocation(props.locationId)
    }
  }, [props.locationId])

  // Get work for editing
  useEffect(() => {
    if (props.workId !== undefined && props.workId !== 0) {
      // Get data from the server
      $.ajax({
        method: 'get',
        url: `${serverUrl}/work/user/~/${props.workId}`,
        headers: {
          ...authHeader
        }
      }).done((data: Work[]) => {
        // Set the states
        setLocation(data[0].location.locationId)
        setDate(new Date(data[0].date))
        setTime(String(data[0].time))
        setDescription(data[0].description)
      })
    } else {
      // Clear the time, description and date
      setTime('0')
      setDescription('')
      setDate(new Date())
    }
  }, [props.workId])

  // Event handlers
  const onSave = () => {
    props.onClose()

    // Push data to the server
    $.ajax({
      url: (props.workId === undefined || props.workId === 0) ? `${serverUrl}/work` : `${serverUrl}/work/user/~/${props.workId}`,
      method: (props.workId === undefined || props.workId === 0) ? 'post' : 'patch',
      headers: {
        ...authHeader
      },
      data: {
        locationId: locationId,
        time: Number(time.replace(',', '.')), // Make time a number
        date: moment(date).format('YYYY-MM-DD'),
        description: description
      }
    }).done(() => {
      props.onSave()

      // Show a toast
      enqueueSnackbar('Saved!', {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Clear the time and description
      setTime('0')
      setDescription('')
    })
  }

  // Remove the item from the server
  const onRemove = () => {
    props.onClose()

    // Push data to the server
    $.ajax({
      url: `${serverUrl}/work/user/~/${props.workId}`,
      method: 'delete',
      headers: {
        ...authHeader
      }
    }).done(() => {
      props.onSave()

      // Show a toast
      enqueueSnackbar('Saved!', {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Clear the time and description
      setTime('0')
      setDescription('')
    })
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>
        What have you done?
      </DialogTitle>
      <DialogContent>
        <Select
          value={locationId}
          onChange={(e) => { setLocation(Number(e.target.value)) }}
          error={locationId === 0}
          fullWidth
        >
          <MenuItem value={0}>Please select a location</MenuItem>
          {locations.map((i) => (
            <MenuItem value={i.locationId} key={i.locationId}>{i.place} - {i.name}</MenuItem>
          ))}
        </Select>

        <TextField
          value={time}
          onChange={e => setTime(e.target.value)}
          label='Time'
          type='text'
          fullWidth
          className={classes.spacing}
          error={(function () {
            // Test if the string is correct
            return !/(^[0-9]{1}|^1[0-9]{1})($|[.,][0-9]{1,2}$)/.test(time)
          })()}
        />

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            value={date}
            onChange={(e) => { setDate(e as Date) }}
            label='Date'
            fullWidth
            className={classes.spacing}
          />
        </MuiPickersUtilsProvider>

        <TextField
          value={description}
          onChange={e => setDescription(e.target.value)}
          label='Description'
          fullWidth
          className={classes.spacing}
        />
      </DialogContent>
      <DialogActions>
        <Typography component='div' hidden={props.workId === undefined || props.workId === 0}>
          <Button color='secondary' onClick={onRemove}>
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
  )
}
