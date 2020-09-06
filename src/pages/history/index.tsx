// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Container, Typography, Fab, Zoom } from '@material-ui/core'
import useStyles from './useStyles'
import ListWork from '../../components/listWork'
import moment from 'moment'
import WorkDialog from '../../components/workDialog'
import { Search as SearchIcon } from '@material-ui/icons'
import SearchDialog from '../../components/searchDialog'
import language from '../../language'

const l = language.historyPage

export default function HistoryPage () {
  const classes = useStyles()

  // States for the date
  const [startDate, setStartDate] = useState(moment().day(-7).format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(moment().day(-1).format('YYYY-MM-DD'))

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

  // State for the dialog
  const [openSearch, setOpenSearch] = useState(false)

  return (
    <Container className={classes.main + ' container'}>
      <Typography variant='h5'>{l.title}</Typography>

      <ListWork startDate={startDate} endDate={endDate} onEdit={onEdit} />

      <Zoom in>
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
      </Zoom>

      <WorkDialog open={workDialog} onClose={addWorkClose} workId={editWorkId} />
      <SearchDialog
        open={openSearch}
        onClose={() => {
          setOpenSearch(false)
        }}
        onChange={(newStartDate, newEndDate) => {
          setStartDate(newStartDate)
          setEndDate(newEndDate)
        }}
      />
    </Container>
  )
}
