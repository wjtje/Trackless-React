// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { Container, Typography, ListItemText, List, ListItem, ListItemIcon } from '@material-ui/core'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import useFetch from 'use-http'
import { Skeleton } from '@material-ui/lab'
import { User } from '../../@types/interfaces'
import {
  VpnKey as PasswordIcon,
  GetApp as DownloadIcon,
  Devices as DevicesIcon,
  Edit as EditIcon
} from '@material-ui/icons'

export default function AccountPage () {
  const classes = useStyles()

  // Get the user info
  const { data = [], loading } : { data: User[]|undefined; loading: boolean; } = useFetch(
    `${serverUrl}/user/~`,
    {
      headers: {
        ...authHeader
      }
    },
    []
  )

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>{(loading) ? <Skeleton /> : `Welcome ${data[0].firstname} ${data[0].lastname}`}</Typography>

      <Typography variant='h6' className={classes.spacing}>Your details</Typography>
      <table>
        <tbody>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>Firstname</Typography>
            <td className={classes.tdLast}>
              {(loading) ? <Skeleton variant='text' /> : data[0].firstname}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>Lastname</Typography>
            <td className={classes.tdLast}>
              {(loading) ? <Skeleton variant='text' /> : data[0].lastname}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>Username</Typography>
            <td className={classes.tdLast}>
              {(loading) ? <Skeleton variant='text' /> : data[0].username}
            </td>
          </tr>
          <tr>
            <Typography variant='body2' component='td' className={classes.tdFirst}>Group</Typography>
            <td className={classes.tdLast}>
              {(loading) ? <Skeleton variant='text' /> : data[0].groupName}
            </td>
          </tr>
        </tbody>
      </table>

      <Typography variant='h6' className={classes.spacing}>Options for your account</Typography>
      <List>
        <ListItem button onClick={() => { }}>
          <ListItemIcon><PasswordIcon /></ListItemIcon>
          <ListItemText primary='Change my password' />
        </ListItem>
        <ListItem button onClick={() => { }}>
          <ListItemIcon><DevicesIcon /></ListItemIcon>
          <ListItemText primary='Devices you&#39;re logged into' />
        </ListItem>
        <ListItem button onClick={() => {}}>
          <ListItemIcon><DownloadIcon /></ListItemIcon>
          <ListItemText primary='Download my details' />
        </ListItem>
        <ListItem button onClick={() => { }}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText primary='Edit your info' />
        </ListItem>
      </List>
    </Container>
  )
}
