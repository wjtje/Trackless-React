// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { Container, Typography, ListItemText, List, ListItem } from '@material-ui/core'
import useStyles from './useStyles'
import { version, serverUrl } from '../../global'
import useFetch from 'use-http'
import { Skeleton } from '@material-ui/lab'
import language from '../../language'
import licenses from '../../licenses.json'

const l = language.settingsPage
const lic = licenses as any

export default function SettingsPage () {
  const classes = useStyles()

  const { data, loading } : { loading: boolean; data: { version: string; }|undefined; } = useFetch(`${serverUrl}/server/about`, {}, [])

  return (
    <Container className={classes.main + ' container'}>
      <Typography variant='h5'>{l.title}</Typography>
      <Typography variant='subtitle1'>{l.about}</Typography>
      <List>
        <ListItem>
          <ListItemText primary={l.clientVersion} secondary={version} />
        </ListItem>
        <ListItem>
          <ListItemText primary={l.serverVersion} secondary={(loading) ? <Skeleton /> : data?.version} />
        </ListItem>
      </List>
      <Typography variant='subtitle1'>Licenses</Typography>
      <List>
        {
          Object.keys(lic).map(key =>
            <ListItem
              key={key}
              button
              onClick={
                () => { window.open(lic[key]?.licenseUrl) }
              }
            >
              <ListItemText primary={key} secondary={lic[key]?.licenses} />
            </ListItem>
          )
        }
      </List>
    </Container>
  )
}
