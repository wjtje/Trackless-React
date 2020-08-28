// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { Container, Typography, ListItemText, List, ListItem } from '@material-ui/core'
import useStyles from './useStyles'
import { version, serverUrl } from '../../global'
import useFetch from 'use-http'
import { Skeleton } from '@material-ui/lab'

export default function SettingsPage () {
  const classes = useStyles()

  const { data, loading } : { loading: boolean; data: { version: string; }|undefined; } = useFetch(`${serverUrl}/server/about`, {}, [])

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>Settings</Typography>
      <Typography variant='subtitle1'>About</Typography>
      <List>
        <ListItem>
          <ListItemText primary='Client version' secondary={version} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Server version' secondary={(loading) ? <Skeleton /> : data?.version} />
        </ListItem>
      </List>
    </Container>
  )
}
