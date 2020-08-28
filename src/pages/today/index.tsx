// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Container, List, ListItem, ListItemText, Typography, Fab } from '@material-ui/core'
import useStyles from './useStyles'
import ListWork from '../../components/listWork'
import moment from 'moment'
import { serverUrl, authHeader } from '../../global'
import useFetch from 'use-http'
import { loadingLocation } from './interfaces'
import { loadingSuggestions } from './skeleton'
import WorkDialog from '../../components/workDialog'
import { Add as AddIcon } from '@material-ui/icons'

export default function TodayPage () {
  const classes = useStyles()

  // Get the most used
  const { data = loadingSuggestions }: { data: loadingLocation[]|undefined } = useFetch(
    `${serverUrl}/location/user/~/most`,
    {
      headers: {
        ...authHeader
      }
    },
    []
  )

  // States for adding work
  const [workDialog, setWorkDialog] = useState(false)
  const [updateListWork, setUpdateListWork] = useState(new Date().toISOString())
  const [mostUsedLocationId, setMostUsedLocationId] = useState(0)
  const addWorkClose = () => {
    // Disable editing and hide the dialog
    setEditWorkId(0)
    setWorkDialog(false)
  }
  const addWorkSave = () => {
    setUpdateListWork(new Date().toISOString())
  }

  // States and handlers for editing work
  const [editWorkId, setEditWorkId] = useState(0)
  const onEdit = (workId: number) => {
    // Enable editing and show the dialog
    setEditWorkId(workId)
    setWorkDialog(true)
  }

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>What have you done today?</Typography>
      <Typography variant='subtitle1'>Suggestions</Typography>

      <List>
        {data?.map((i) => (
          <ListItem
            button
            key={i.locationId}
            onClick={() => {
              // Update the locationId and show the dialog
              setMostUsedLocationId(i.locationId)
              setWorkDialog(true)
            }}
          >
            <ListItemText primary={i.name} secondary={i.place} />
          </ListItem>
        ))}
      </List>

      <ListWork startDate={moment().format('YYYY-MM-DD')} endDate={moment().format('YYYY-MM-DD')} update={updateListWork} onEdit={onEdit} />

      <Fab
        color='primary'
        aria-label='add'
        className={classes.fab}
        onClick={() => {
          // Disable editing and show workDialog
          setEditWorkId(0)
          setWorkDialog(true)
        }}
      >
        <AddIcon />
      </Fab>
      <WorkDialog open={workDialog} onClose={addWorkClose} onSave={addWorkSave} update={updateListWork} locationId={mostUsedLocationId} workId={editWorkId} />
    </Container>
  )
}
