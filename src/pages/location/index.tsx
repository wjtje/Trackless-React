// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Container, Typography, Fab, ListItem, ListItemText, List, TextField } from '@material-ui/core'
import useStyles from './useStyles'
import { Add as AddIcon } from '@material-ui/icons'
import { Location } from '../../@types/interfaces'
import { serverUrl, authHeader } from '../../global'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import './style.scss'
import LocationDialog from '../../components/locationDialog'
import $ from 'jquery'

export default function TodayPage () {
  const classes = useStyles()

  // Get the user info
  const [update, setUpdate] = useState(new Date().toISOString())
  const [data, setData] = useState([] as Array<Location>)
  useEffect(() => {
    $.ajax({
      url: `${serverUrl}/location`,
      headers: {
        ...authHeader,
        update: update
      }
    }).done((e) => {
      setData(e)
    })
  }, [update])

  const [search, setSearch] = useState('')
  const [locations, setLocation] = useState([] as Location[])

  // Update locations when data or search changes
  useEffect(() => {
    const s = search.toLowerCase()

    setLocation(data.filter(location => {
      // Search array
      return (
        location.place.toLowerCase().indexOf(s) !== -1 ||
        location.name.toLowerCase().indexOf(s) !== -1 ||
        location.id.toLowerCase().indexOf(s) !== -1
      )
    }))
  }, [search, data])

  // States and function for the dialog
  const [open, setOpen] = useState(false)
  const [locationId, setLocationId] = useState(0)
  const onClose = () => {
    setOpen(false)
  }
  const onSave = () => {
    // Update the locations
    setUpdate(new Date().toISOString())
  }

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>Locations</Typography>

      <List className='list'>
        <TextField label='search' fullWidth className={classes.search} value={search} onChange={e => setSearch(e.target.value)} />
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={56}
              itemCount={locations.length}
            >
              {({ index, style }) => (
                <ListItem
                  key={locations[index].locationId}
                  style={style}
                  button
                  onClick={() => {
                    // Set the correct id
                    setLocationId(locations[index].locationId)
                    setOpen(true)
                  }}
                >
                  <ListItemText primary={`${locations[index].place} - ${locations[index].name}`} secondary={locations[index].id} />
                </ListItem>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </List>

      <Fab
        color='primary'
        aria-label='add'
        className={classes.fab}
        onClick={() => {
          // Disable editing and show the dialog
          setLocationId(0)
          setOpen(true)
        }}
      >
        <AddIcon />
      </Fab>

      <LocationDialog open={open} onClose={onClose} onSave={onSave} locationId={locationId} />
    </Container>
  )
}
