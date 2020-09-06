// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Container, Typography, Fab, Zoom } from '@material-ui/core'
import useStyles from './useStyles'
import ListWork from '../../components/listWork'
import moment from 'moment'
import WorkDialog from '../../components/workDialog'
import { Add as AddIcon } from '@material-ui/icons'
import language from '../../language'

const l = language.thisWeekPage

export default function ThisWeekPage () {
  const classes = useStyles()

  // States for adding work
  const [workDialog, setWorkDialog] = useState(false)
  const addWorkClose = () => {
    // Disable editing and hide the dialog
    setEditWorkId(0)
    setWorkDialog(false)
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
      <Typography variant='h5'>{l.title}</Typography>

      <ListWork startDate={moment().day(0).format('YYYY-MM-DD')} endDate={moment().day(7).format('YYYY-MM-DD')} onEdit={onEdit} />

      <Zoom in>
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
      </Zoom>

      <WorkDialog open={workDialog} onClose={addWorkClose} workId={editWorkId} />
    </Container>
  )
}
