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
import ActiveDevices from './dialogs/activeDevices'
import language from '../../language'

const l = language.accountPage

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
  const [openActiveDevices, setOpenActiveDevices] = useState(false)

  return (
    <Container className={classes.main + ' container'}>
      <Typography variant='h5'>{(data[0] === undefined) ? <Skeleton /> : `${l.welcome} ${data[0].firstname} ${data[0].lastname}`}</Typography>

      <Typography variant='h6' className={classes.spacing}>{l.yourDetails}</Typography>
      <table>
        <tbody>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>{l.firstname}</Typography>
            <td className={classes.tdLast}>
              {(data[0] === undefined) ? <Skeleton variant='text' /> : data[0].firstname}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>{l.lastname}</Typography>
            <td className={classes.tdLast}>
              {(data[0] === undefined) ? <Skeleton variant='text' /> : data[0].lastname}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>{l.username}</Typography>
            <td className={classes.tdLast}>
              {(data[0] === undefined) ? <Skeleton variant='text' /> : data[0].username}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>{l.group}</Typography>
            <td className={classes.tdLast}>
              {(data[0] === undefined) ? <Skeleton variant='text' /> : data[0].groupName}
            </td>
          </tr>
        </tbody>
      </table>

      <Typography variant='h6' className={classes.spacing}>{l.options}</Typography>
      <List>
        <ListItem button onClick={() => { setOpenPassword(true) }}>
          <ListItemIcon><PasswordIcon /></ListItemIcon>
          <ListItemText primary={l.changePassword} />
        </ListItem>
        <ListItem button onClick={() => { setOpenActiveDevices(true) }}>
          <ListItemIcon><DevicesIcon /></ListItemIcon>
          <ListItemText primary={l.activeDevices} />
        </ListItem>
        <ListItem button onClick={() => { setOpenDownload(true) }}>
          <ListItemIcon><DownloadIcon /></ListItemIcon>
          <ListItemText primary={l.downloadDetails} />
        </ListItem>
        <ListItem button onClick={() => { setOpenEdit(true) }}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText primary={l.editUser} />
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
      <ActiveDevices
        open={openActiveDevices}
        onClose={() => {
          setOpenActiveDevices(false)
        }}
      />
    </Container>
  )
}
