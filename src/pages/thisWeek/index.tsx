// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Container, Typography, Fab, Zoom } from '@material-ui/core'
import useStyles from './useStyles'
import ListWork from '../../components/listWork'
import moment from 'moment'
import WorkDialog from '../../components/workDialog'
import { Add as AddIcon } from '@material-ui/icons'
import language from '../../language'
import { Work } from '../../@types/interfaces'

const l = language.thisWeekPage

export default function ThisWeekPage () {
  const classes = useStyles()

  // States for adding work
  const [workDialog, setWorkDialog] = useState(false)
  const addWorkClose = () => {
    // Disable editing and hide the dialog
    setEditWork(null)
    setWorkDialog(false)
  }

  // States and handlers for editing work
  const [editWork, setEditWork] = useState(null as Work | null)
  const onEdit = (work: Work) => {
    // Enable editing and show the dialog
    setEditWork(work)
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
            setEditWork(null)
            setWorkDialog(true)
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      <WorkDialog open={workDialog} onClose={addWorkClose} editWork={editWork} />
    </Container>
  )
}
