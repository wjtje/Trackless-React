// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, TextField, DialogContentText, CircularProgress, MenuItem, Select } from '@material-ui/core'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import $ from 'jquery'
import { useSnackbar } from 'notistack'
import language from '../../language'
import useGroup from '../../hooks/useGroup'
import useUser from '../../hooks/useUsers'

const l = language.addUserDialog
const lg = language.global

export default function AddUserDialog (props: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const { groups } = useGroup()
  const { reloadUsers } = useUser()

  // States for the inputs
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [username, setUsername] = useState('')
  const [groupID, setgroupID] = useState(0)
  const [password, setPassword] = useState('')
  const [passwordRE, setPasswordRE] = useState('')

  const [loading, setLoading] = useState(false)

  // Event handlers
  const onSave = () => {
    setLoading(true)

    // Test the data
    if (
      firstname === '' ||
      lastname === '' ||
      username === '' ||
      groupID === 0 ||
      password === '' ||
      password !== passwordRE
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
        url: `${serverUrl}/user`,
        method: 'post',
        headers: {
          ...authHeader
        },
        data: {
          firstname: firstname,
          lastname: lastname,
          username: username,
          password: password,
          groupID: groupID
        }
      }).done(() => {
        reloadUsers() // Get the new users from the server
        props.onClose()
        setLoading(false)

        // Show a toast
        enqueueSnackbar(lg.saved, {
          variant: 'success',
          autoHideDuration: 2000
        })

        // Clear the inputs
        setFirstname('')
        setLastname('')
        setUsername('')
        setgroupID(0)
        setPassword('')
        setPasswordRE('')
      }).fail(() => {
        setLoading(false)
      })
    }
  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
        <DialogTitle>
          {l.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {l.content}
          </DialogContentText>
          <TextField
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            label={l.firstname}
            fullWidth
            className={classes.spacing}
            error={firstname === ''}
          />

          <TextField
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            label={l.lastname}
            fullWidth
            className={classes.spacing}
            error={lastname === ''}
          />

          <TextField
            value={username}
            onChange={e => setUsername(e.target.value)}
            label={l.username}
            fullWidth
            className={classes.spacing}
            error={username === ''}
          />

          <TextField
            value={password}
            onChange={e => setPassword(e.target.value)}
            label={l.password}
            fullWidth
            className={classes.spacing}
            error={password === ''}
            type='password'
          />

          <TextField
            value={passwordRE}
            onChange={e => setPasswordRE(e.target.value)}
            label={l.passwordRE}
            fullWidth
            className={classes.spacing}
            error={passwordRE !== password || passwordRE === ''}
            type='password'
          />

          <Select
            value={groupID}
            onChange={(e) => { setgroupID(Number(e.target.value)) }}
            error={groupID === 0}
            fullWidth
            MenuProps={{
              transitionDuration: 0
            }}
            style={{
              marginTop: 16
            }}
          >
            <MenuItem value={0}>{l.selectGroup}</MenuItem>
            {groups.map((i) => (
              <MenuItem value={i.groupID} key={i.groupID}>{i.groupName}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
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
    </div>
  )
}
