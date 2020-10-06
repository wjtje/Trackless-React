// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, Select, MenuItem, TextField, Typography, DialogContentText, CircularProgress } from '@material-ui/core'
import useLocation from '../../hooks/useLocation'
import { DatePicker } from '@material-ui/pickers'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import moment from 'moment'
import $ from 'jquery'
import { Work } from '../../@types/interfaces'
import { useSnackbar } from 'notistack'
import RemoveDialog from '../RemoveDialog'
import language from '../../language'
import useDatabase from '../../hooks/useDatabase'
import _ from 'lodash'

const l = language.workDialog
const lg = language.global

export default function WorkDialog (props: {
  open: boolean;
  onClose: () => void;
  locationID?: number;
  editWork?: Work | null;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { addWork, removeWork, location, me, worktype } = useDatabase()

  // Get all the locations
  const { lastUsed } = useLocation()

  // States for the inputs
  const [locationID, setLocation] = useState(0)
  const [time, setTime] = useState('')
  const [date, setDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const [worktypeID, setWorktype] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingDel, setLoadingDel] = useState(false)

  // Update lastUsed location
  useEffect(() => {
    setLocation(lastUsed[0]?.locationID)
  }, [lastUsed])

  // Update most used location
  useEffect(() => {
    if (props.locationID !== 0 && props.locationID !== undefined) {
      setLocation(props.locationID)
    }
  }, [props.locationID])

  // Check if worktypeID 1 is valid
  useEffect(() => {
    if (worktype[0] != null) {
      setWorktype(worktype[0].worktypeID)
    }
  }, [worktype])

  // Get work for editing
  useEffect(() => {
    if (props.editWork != null) {
      // Set the states
      setLocation(props.editWork.location.locationID)
      setTime(String(props.editWork.time))
      setDate(new Date(props.editWork.date))
      setDescription(props.editWork.description)
      setWorktype(props.editWork.worktype.worktypeID)
    }
  }, [props.editWork])

  // Event handlers
  const onSave = () => {
    setLoading(true)

    // Test the data
    if (
      description === '' ||
      time === '' ||
      locationID === 0 ||
      worktypeID === 0
    ) {
      // Something is wrong
      setLoading(false)
      enqueueSnackbar(l.errInput, {
        variant: 'error',
        autoHideDuration: 2000
      })
    } else {
      // Push data to the server
      $.ajax({
        url: (props.editWork == null) ? `${serverUrl}/user/~/work` : `${serverUrl}/user/~/work/${props.editWork.workID}`,
        method: (props.editWork == null) ? 'post' : 'patch',
        headers: {
          ...authHeader
        },
        data: {
          locationID: locationID,
          time: Number(time.replace(',', '.')), // Make time a number
          date: moment(date).format('YYYY-MM-DD'),
          description: description,
          worktypeID: worktypeID
        }
      }).done((result: {
        workID: number
      }) => {
        props.onClose()
        setLoading(false)

        // Show a toast
        enqueueSnackbar(lg.saved, {
          variant: 'success',
          autoHideDuration: 2000
        })

        // Push the data to the local DB
        const loc = location[_.findIndex(location, ['locationID', locationID])]
        const wor = worktype[_.findIndex(worktype, ['worktypeID', worktypeID])]
        removeWork(props.editWork?.workID || 0)
        addWork({
          workID: props.editWork?.workID || result.workID,
          date: moment(date).format('YYYY-MM-DD'),
          time: Number(time.replace(',', '.')),
          description: description,
          location: loc,
          worktype: wor,
          user: me[0]
        })

        // Clear the time and description
        setTime('')
        setDescription('')
      }).fail(() => {
        setLoading(false)
      })
    }
  }

  // Remove the item from the server
  const [open, setOpen] = useState(false)
  const onRemove = () => {
    setOpen(false)

    // Push data to the server
    $.ajax({
      url: `${serverUrl}/user/~/work/${props.editWork?.workID}`,
      method: 'delete',
      headers: {
        ...authHeader
      }
    }).done(() => {
      props.onClose()
      setLoadingDel(false)

      // Show a toast
      enqueueSnackbar(lg.removed, {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Clear the time and description
      setTime('')
      setDescription('')

      // Remove from the local DB
      removeWork(props.editWork?.workID || 0)
    }).fail(() => {
      setLoadingDel(false)
    })
  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
        <DialogTitle>
          {(props.editWork == null) ? l.titleAdd : l.titleEdit}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {l.content}
          </DialogContentText>
          <Select
            value={locationID}
            onChange={(e) => { setLocation(Number(e.target.value)) }}
            error={locationID === 0}
            fullWidth
            MenuProps={{
              transitionDuration: 0
            }}
          >
            <MenuItem value={0}>{l.selectLocation}</MenuItem>
            {location.map((i) => (
              <MenuItem value={i.locationID} key={i.locationID}>{i.place} - {i.name}</MenuItem>
            ))}
          </Select>

          <DatePicker
            value={date}
            onChange={(e) => { setDate(e as Date) }}
            label={l.date}
            fullWidth
            className={classes.spacing}
          />

          <TextField
            value={description}
            onChange={e => setDescription(e.target.value)}
            label={l.comment}
            fullWidth
            className={classes.spacing}
            error={description === ''}
          />

          <TextField
            value={time}
            onChange={e => setTime(e.target.value)}
            label={l.duration}
            type='number'
            fullWidth
            className={classes.spacing}
            error={(function () {
              // Test if the string is correct
              return !/(^[0-9]{1}|^1[0-9]{1})($|[.,][0-9]{1,2}$)/.test(time)
            })()}
          />

          <Select
            value={worktypeID}
            onChange={(e) => { setWorktype(Number(e.target.value)) }}
            error={worktypeID === 0}
            fullWidth
            style={{
              marginTop: 16
            }}
            MenuProps={{
              transitionDuration: 0
            }}
          >
            <MenuItem value={0}>{l.selectWorktype}</MenuItem>
            {worktype.map((i) => (
              <MenuItem value={i.worktypeID} key={i.worktypeID}>{i.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Typography component='div' hidden={props.editWork == null} className={classes.wrapper}>
            <Button
              color='secondary'
              onClick={() => { setOpen(true); setLoadingDel(true) }}
              disabled={loadingDel || !navigator.onLine}
            >
              {lg.btnRemove}
            </Button>
            {loadingDel && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Typography>
          <div className={classes.wrapper}>
            <Button
              color='primary'
              onClick={onSave}
              disabled={loading || !navigator.onLine}
            >
              {lg.btnSave}
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
          <Button color='primary' onClick={props.onClose}>
            {lg.btnClose}
          </Button>
        </DialogActions>
      </Dialog>

      <RemoveDialog open={open} onClose={() => { setOpen(false); setLoadingDel(false) }} onRemove={onRemove} />
    </div>
  )
}
