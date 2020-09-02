// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Container, Typography, List, TextField, ListItem, ListItemText } from '@material-ui/core'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { User } from '../../@types/interfaces'
import $ from 'jquery'
import './style.scss'
import ListSkeleton from '../../components/ListSkeleton'

export default function UserPage () {
  const classes = useStyles()

  // Get the info
  const [update] = useState(new Date().toISOString())
  const [data, setData] = useState([] as User[])
  useEffect(() => {
    $.ajax({
      url: `${serverUrl}/user`,
      headers: {
        ...authHeader,
        update: update
      }
    }).done((e) => {
      setData(e)
    })
  }, [update])

  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([] as User[])

  // Update when search changes
  useEffect(() => {
    const s = search.toLowerCase()

    setUsers(data.filter(user => {
      // Search array
      return (
        user.firstname.toLowerCase().indexOf(s) !== -1 ||
        user.lastname.toLowerCase().indexOf(s) !== -1 ||
        user.username.toLowerCase().indexOf(s) !== -1
      )
    }))
  }, [search, data])

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>Users</Typography>

      <List className='list'>
        <TextField
          label='Search'
          fullWidth
          className={classes.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {(users.length === 0) ? <ListSkeleton times={3} /> : null}
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={56}
              itemCount={users.length}
            >
              {({ index, style }) => (
                <ListItem
                  key={users[index].userId}
                  style={style}
                  button
                  onClick={() => {
                    // Set the correct id
                  }}
                >
                  <ListItemText
                    primary={`${users[index].firstname} ${users[index].lastname}`}
                    secondary={users[index].username}
                  />
                </ListItem>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </List>
    </Container>
  )
}
