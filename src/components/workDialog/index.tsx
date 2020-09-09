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
import useWork from '../../hooks/useWork'
import useWorktypes from '../../hooks/useWorktypes'

const l = language.workDialog
const lg = language.global

export default function WorkDialog (props: {
  open: boolean;
  onClose: () => void;
  locationId?: number;
  editWork?: Work | null;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { update } = useWork()

  // Get all the locations
  const { locations, lastUsed } = useLocation()
  const { worktypes } = useWorktypes()

  // States for the inputs
  const [locationId, setLocation] = useState(0)
  const [time, setTime] = useState('')
  const [date, setDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const [worktypeId, setWorktype] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingDel, setLoadingDel] = useState(false)

  // Update lastUsed location
  useEffect(() => {
    setLocation(lastUsed[0]?.locationId)
  }, [lastUsed])

  // Update most used location
  useEffect(() => {
    if (props.locationId !== 0 && props.locationId !== undefined) {
      setLocation(props.locationId)
    }
  }, [props.locationId])

  // Check if worktypeId 1 is valid
  useEffect(() => {
    if (worktypes[0] != null) {
      setWorktype(worktypes[0].worktypeId)
    }
  }, [worktypes])

  // Get work for editing
  useEffect(() => {
    if (props.editWork != null) {
      // Set the states
      setLocation(props.editWork.location.locationId)
      setTime(String(props.editWork.time))
      setDate(new Date(props.editWork.date))
      setDescription(props.editWork.description)
      setWorktype(props.editWork.worktype.worktypeId)
    }
  }, [props.editWork])

  // Event handlers
  const onSave = () => {
    setLoading(true)

    // Push data to the server
    $.ajax({
      url: (props.editWork == null) ? `${serverUrl}/work` : `${serverUrl}/work/user/~/${props.editWork.workId}`,
      method: (props.editWork == null) ? 'post' : 'patch',
      headers: {
        ...authHeader
      },
      data: {
        locationId: locationId,
        time: Number(time.replace(',', '.')), // Make time a number
        date: moment(date).format('YYYY-MM-DD'),
        description: description,
        worktypeId: worktypeId
      }
    }).done(() => {
      props.onClose()
      setLoading(false)

      // Show a toast
      enqueueSnackbar(lg.saved, {
        variant: 'success',
        autoHideDuration: 2000
      })

      // Clear the time and description
      setTime('0')
      setDescription('')

      // Reload the work data
      update()
    }).fail(() => {
      setLoading(false)
    })
  }

  // Remove the item from the server
  const [open, setOpen] = useState(false)
  const onRemove = () => {
    setOpen(false)

    // Push data to the server
    $.ajax({
      url: `${serverUrl}/work/user/~/${props.editWork?.workId}`,
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
      setTime('0')
      setDescription('')

      // Realod the work data
      update()
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
            value={locationId}
            onChange={(e) => { setLocation(Number(e.target.value)) }}
            error={locationId === 0}
            fullWidth
            MenuProps={{
              transitionDuration: 0
            }}
          >
            <MenuItem value={0}>{l.selectLocation}</MenuItem>
            {locations.map((i) => (
              <MenuItem value={i.locationId} key={i.locationId}>{i.place} - {i.name}</MenuItem>
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
            value={worktypeId}
            onChange={(e) => { setWorktype(Number(e.target.value)) }}
            error={worktypeId === 0}
            fullWidth
            style={{
              marginTop: 16
            }}
            MenuProps={{
              transitionDuration: 0
            }}
          >
            <MenuItem value={0}>{l.selectWorktype}</MenuItem>
            {worktypes.map((i) => (
              <MenuItem value={i.worktypeId} key={i.worktypeId}>{i.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Typography component='div' hidden={props.editWork == null} className={classes.wrapper}>
            <Button color='secondary' onClick={() => { setOpen(true); setLoadingDel(true) }} disabled={loadingDel}>
              {lg.btnRemove}
            </Button>
            {loadingDel && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Typography>
          <div className={classes.wrapper}>
            <Button color='primary' onClick={onSave} disabled={loading}>
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
