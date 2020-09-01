// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Container, Typography, ListItemText, List, ListItem, ListItemIcon } from '@material-ui/core'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import { Skeleton } from '@material-ui/lab'
import { User } from '../../@types/interfaces'
import {
  VpnKey as PasswordIcon,
  GetApp as DownloadIcon,
  Devices as DevicesIcon,
  Edit as EditIcon
} from '@material-ui/icons'
import $ from 'jquery'
import ChangePassword from './dialogs/changePassword'
import EditUser from './dialogs/editUser'
import DownloadDetails from './dialogs/downloadInfo'

export default function AccountPage () {
  const classes = useStyles()

  // Get the user info
  const [update, setUpdate] = useState(new Date().toISOString())
  const [data, setData] = useState([] as User[])
  useEffect(() => {
    $.ajax({
      url: `${serverUrl}/user/~`,
      headers: {
        ...authHeader
      }
    }).done((e) => {
      setData(e)
    })
  }, [update])

  // States for dialogs
  const [openPassword, setOpenPassword] = useState(false)
  const [openDownload, setOpenDownload] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>{(data[0] === undefined) ? <Skeleton /> : `Welcome ${data[0].firstname} ${data[0].lastname}`}</Typography>

      <Typography variant='h6' className={classes.spacing}>Your details</Typography>
      <table>
        <tbody>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>Firstname</Typography>
            <td className={classes.tdLast}>
              {(data[0] === undefined) ? <Skeleton variant='text' /> : data[0].firstname}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>Lastname</Typography>
            <td className={classes.tdLast}>
              {(data[0] === undefined) ? <Skeleton variant='text' /> : data[0].lastname}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>Username</Typography>
            <td className={classes.tdLast}>
              {(data[0] === undefined) ? <Skeleton variant='text' /> : data[0].username}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>Group</Typography>
            <td className={classes.tdLast}>
              {(data[0] === undefined) ? <Skeleton variant='text' /> : data[0].groupName}
            </td>
          </tr>
        </tbody>
      </table>

      <Typography variant='h6' className={classes.spacing}>Options for your account</Typography>
      <List>
        <ListItem button onClick={() => { setOpenPassword(true) }}>
          <ListItemIcon><PasswordIcon /></ListItemIcon>
          <ListItemText primary='Change my password' />
        </ListItem>
        <ListItem button onClick={() => { }}>
          <ListItemIcon><DevicesIcon /></ListItemIcon>
          <ListItemText primary='Devices you&#39;re logged into' />
        </ListItem>
        <ListItem button onClick={() => { setOpenDownload(true) }}>
          <ListItemIcon><DownloadIcon /></ListItemIcon>
          <ListItemText primary='Download my details' />
        </ListItem>
        <ListItem button onClick={() => { setOpenEdit(true) }}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText primary='Edit your info' />
        </ListItem>
      </List>

      <ChangePassword
        open={openPassword}
        onClose={() => {
          setOpenPassword(false)
        }}
      />
      <DownloadDetails
        open={openDownload}
        onClose={() => {
          setOpenDownload(false)
        }}
      />
      <EditUser
        open={openEdit}
        onClose={() => {
          setOpenEdit(false)
        }}
        onSave={() => {
          // Force update
          setUpdate(new Date().toISOString())
        }}
        userInfo={{
          firstname: data[0]?.firstname || 'Jhon',
          lastname: data[0]?.lastname || 'Doe'
        }}
      />
    </Container>
  )
}
