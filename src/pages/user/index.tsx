// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Container, Typography, List, TextField, ListItem, ListItemText } from '@material-ui/core'
import useStyles from './useStyles'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { User } from '../../@types/interfaces'
import './style.scss'
import ListSkeleton from '../../components/ListSkeleton'
import language from '../../language'
import useUser from '../../hooks/useUsers'

const l = language.userPage
const lg = language.global

export default function UserPage () {
  const classes = useStyles()
  const { users } = useUser()

  // Get the info
  const [search, setSearch] = useState('')
  const [list, setList] = useState([] as User[])

  // Update when search changes
  useEffect(() => {
    const s = search.toLowerCase()

    setList(users.filter(user => {
      // Search array
      return (
        user.firstname.toLowerCase().indexOf(s) !== -1 ||
        user.lastname.toLowerCase().indexOf(s) !== -1 ||
        user.username.toLowerCase().indexOf(s) !== -1
      )
    }))
  }, [search, users])

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>{l.title}</Typography>

      <List className='list'>
        <TextField
          label={lg.search}
          fullWidth
          className={classes.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {(list.length === 0) ? <ListSkeleton times={3} /> : null}
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={56}
              itemCount={list.length}
            >
              {({ index, style }) => (
                <ListItem
                  key={list[index].userId}
                  style={style}
                  button
                  onClick={() => {
                    // Set the correct id
                  }}
                >
                  <ListItemText
                    primary={`${list[index].firstname} ${list[index].lastname}`}
                    secondary={list[index].username}
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
