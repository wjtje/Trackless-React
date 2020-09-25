// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Container, Typography, Fab, ListItem, ListItemText, List, TextField, Zoom } from '@material-ui/core'
import useStyles from './useStyles'
import { Add as AddIcon } from '@material-ui/icons'
import { Location } from '../../@types/interfaces'
import { serverUrl, authHeader } from '../../global'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import './style.scss'
import LocationDialog from '../../components/locationDialog'
import $ from 'jquery'
import ListSkeleton from '../../components/ListSkeleton'
import language from '../../language'

const l = language.locationPage
const lg = language.global

export default function TodayPage () {
  const classes = useStyles()

  // States
  const [update, setUpdate] = useState(new Date().toISOString())
  const [data, setData] = useState([] as Array<Location>)
  const [search, setSearch] = useState('')
  const [locations, setLocation] = useState([] as Location[])
  const [open, setOpen] = useState(false)
  const [editLocation, setEditLocation] = useState({
    locationID: 0,
    hidden: 0,
    name: '',
    place: '',
    id: ''
  } as Location)

  // Get the data from the server
  useEffect(() => {
    $.ajax({
      url: `${serverUrl}/location?hidden`,
      headers: {
        ...authHeader,
        update: update
      }
    }).done((e) => {
      setData(e)
    })
  }, [update])

  // Sort the data if the data changes or the search changes
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
        {(locations.length === 0) ? <ListSkeleton times={3} /> : null}
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
                  key={locations[index].locationID}
                  style={style}
                  button
                  onClick={() => {
                    // Set the edit locations and show the dialog
                    setEditLocation(locations[index])
                    setOpen(true)
                  }}
                >
                  <ListItemText
                    className={(locations[index].hidden) ? classes.itemDisabled : ''}
                    primary={`${locations[index].place} - ${locations[index].name}`}
                    secondary={locations[index].id}
                  />
                </ListItem>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </List>

      <Zoom in>
        <Fab
          color='primary'
          aria-label='add'
          className={classes.fab}
          onClick={() => {
            // Disable editing and show the dialog
            setEditLocation({
              locationID: 0,
              hidden: 0,
              name: '',
              place: '',
              id: ''
            })
            setOpen(true)
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      <LocationDialog
        open={open}
        onClose={() => { setOpen(false) }}
        onSave={() => {
          // Force reload the page
          setUpdate(new Date().toISOString())
        }}
        editLocation={editLocation}
      />
    </Container>
  )
}
