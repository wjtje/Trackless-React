// Copyright (c) 2020 Wouter van der Wal

import React, { useEffect, useState } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, TextField, DialogContentText, CircularProgress, MenuItem, Select, Typography } from '@material-ui/core'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import $ from 'jquery'
import { useSnackbar } from 'notistack'
import language from '../../language'
import useGroup from '../../hooks/useGroup'
import useUser from '../../hooks/useUsers'
import { User } from '../../@types/interfaces'
import RemoveDialog from '../RemoveDialog'

const l = language.userDialog
const lg = language.global

export default function UserDialog (props: {
  open: boolean;
  onClose: () => void;
  editUser?: User | null
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
  const [loadingRemove, setLoadingRemove] = useState(false)
  const [open, setOpen] = useState(false) // Remove dialog

  // Get a user for editing
  useEffect(() => {
    if (props.editUser != null) {
      setUsername(props.editUser.username)
      setFirstname(props.editUser.firstname)
      setLastname(props.editUser.lastname)
      setgroupID(props.editUser.groupID)
    }
  }, [props.editUser])

  // Event handlers
  // For saving new users or editing them
  const onSave = () => {
    setLoading(true)

    if (props.editUser == null) {
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
    } else {
      // Patch the user
      // Test the data
      if (
        firstname === '' ||
        lastname === '' ||
        username === '' ||
        groupID === 0 ||
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
          url: `${serverUrl}/user/${props.editUser.userID}`,
          method: 'patch',
          headers: {
            ...authHeader
          },
          data: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            ...(password === '') ? {} : { password: password }
          }
        }).done(() => {
          // Change the group
          $.ajax({
            url: `${serverUrl}/group/${groupID}/user`,
            method: 'post',
            headers: {
              ...authHeader
            },
            data: {
              userID: props.editUser?.userID
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
        }).fail(() => {
          setLoading(false)
        })
      }
    }
  }

  // Function for removing work
  const onDelete = () => {
    $.ajax({
      url: `${serverUrl}/user/${props.editUser?.userID}`,
      method: 'delete',
      headers: {
        ...authHeader
      }
    }).done(() => {
      reloadUsers() // Get the new users from the server
      props.onClose()
      setLoadingRemove(false)

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
      setLoadingRemove(false)
    })
  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
        <DialogTitle>
          {(props.editUser == null) ? l.title : l.editTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(props.editUser == null) ? l.content : l.editContent}
          </DialogContentText>
          <TextField
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            label={l.firstname}
            margin='normal'
            fullWidth
            variant='outlined'
            className={classes.spacing}
            error={firstname === ''}
          />

          <TextField
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            label={l.lastname}
            margin='normal'
            fullWidth
            variant='outlined'
            className={classes.spacing}
            error={lastname === ''}
          />

          <TextField
            value={username}
            onChange={e => setUsername(e.target.value)}
            label={l.username}
            margin='normal'
            fullWidth
            variant='outlined'
            className={classes.spacing}
            error={username === ''}
          />

          <TextField
            value={password}
            onChange={e => setPassword(e.target.value)}
            label={l.password}
            margin='normal'
            fullWidth
            variant='outlined'
            className={classes.spacing}
            error={password === '' && props.editUser == null}
            type='password'
          />

          <TextField
            value={passwordRE}
            onChange={e => setPasswordRE(e.target.value)}
            label={l.passwordRE}
            margin='normal'
            fullWidth
            variant='outlined'
            className={classes.spacing}
            error={passwordRE !== password || (passwordRE === '' && props.editUser == null)}
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
            variant='outlined'
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
          <Typography component='div' hidden={props.editUser == null} className={classes.wrapper}>
            <Button
              color='primary'
              onClick={() => { setOpen(true); setLoadingRemove(true) }}
              disabled={loadingRemove || !navigator.onLine}
            >
              {lg.btnRemove}
            </Button>
            {loadingRemove && <CircularProgress size={24} className={classes.buttonProgress} />}
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

        <RemoveDialog open={open} onClose={() => { setOpen(false); setLoadingRemove(false) }} onRemove={onDelete} />
      </Dialog>
    </div>
  )
}
