// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Container, Typography, Fab } from '@material-ui/core'
import useStyles from './useStyles'
import ListWork from '../../components/listWork'
import moment from 'moment'
import WorkDialog from '../../components/workDialog'
import { Search as SearchIcon } from '@material-ui/icons'
import SearchDialog from './searchDialog'

export default function HistoryPage () {
  const classes = useStyles()

  // States for the date
  const [startDate, setStartDate] = useState(moment().day(-7).format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(moment().day(-1).format('YYYY-MM-DD'))

  // States for adding work
  const [workDialog, setWorkDialog] = useState(false)
  const [updateListWork, setUpdateListWork] = useState(new Date().toISOString())
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

  // State for the dialog
  const [openSearch, setOpenSearch] = useState(false)

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>What have you done in the past?</Typography>

      <ListWork startDate={startDate} endDate={endDate} update={updateListWork} onEdit={onEdit} />

      <Fab
        color='primary'
        aria-label='add'
        className={classes.fab}
        onClick={() => {
          setOpenSearch(true)
        }}
      >
        <SearchIcon />
      </Fab>
      <WorkDialog open={workDialog} onClose={addWorkClose} onSave={addWorkSave} update={updateListWork} workId={editWorkId} />
      <SearchDialog
        open={openSearch}
        onClose={() => {
          setOpenSearch(false)
        }}
        onChange={(newStartDate, newEndDate) => {
          setUpdateListWork(new Date().toISOString())
          setStartDate(newStartDate)
          setEndDate(newEndDate)
        }}
      />
    </Container>
  )
}
