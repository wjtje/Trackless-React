// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Container, List, ListItem, ListItemText, Typography, Fab, Zoom } from '@material-ui/core'
import useStyles from './useStyles'
import ListWork from '../../components/listWork'
import moment from 'moment'
import { loadingSuggestions } from './skeleton'
import WorkDialog from '../../components/workDialog'
import { Add as AddIcon } from '@material-ui/icons'
import language from '../../language'
import useLocation from '../../hooks/useLocation'
import { Work } from '../../@types/interfaces'

const l = language.todayPage

export default function TodayPage () {
  const classes = useStyles()
  const { mostUsed } = useLocation()

  // States for adding work
  const [workDialog, setWorkDialog] = useState(false)
  const [mostUsedlocationID, setMostUsedlocationID] = useState(0)
  const [editWork, setEditWork] = useState(null as Work | null)
  const addWorkClose = () => {
    // Disable editing and hide the dialog
    setEditWork(null)
    setWorkDialog(false)
  }

  // States and handlers for editing work
  const onEdit = (work: Work) => {
    // Enable editing and show the dialog
    setEditWork(work)
    setWorkDialog(true)
  }

  return (
    <Container className={classes.main + ' container'}>
      <Typography variant='h5'>{l.title}</Typography>
      <Typography variant='subtitle1'>{l.suggestions}</Typography>

      <List>
        {((mostUsed.length === 0) ? loadingSuggestions : mostUsed).map((i) => (
          <ListItem
            button
            key={i.locationID}
            onClick={() => {
              // Update the locationID and show the dialog
              setMostUsedlocationID(i.locationID)
              setWorkDialog(true)
            }}
          >
            <ListItemText primary={i.name} secondary={i.place} />
          </ListItem>
        ))}
      </List>

      <ListWork
        startDate={moment().format('YYYY-MM-DD')}
        endDate={moment().format('YYYY-MM-DD')}
        onEdit={onEdit}
      />

      <Zoom in>
        <Fab
          color='primary'
          aria-label='add'
          className={classes.fab}
          onClick={() => {
            // Disable editing and show workDialog
            setEditWork(null)
            setWorkDialog(true)
          }}
          disabled={!navigator.onLine}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      <WorkDialog
        open={workDialog}
        onClose={addWorkClose}
        locationID={mostUsedlocationID}
        editWork={editWork}
      />
    </Container>
  )
}
