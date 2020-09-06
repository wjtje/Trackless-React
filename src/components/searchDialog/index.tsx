// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import language from '../../language'

const l = language.searchDialog
const lg = language.global

export default function SearchDialog (props: {
  open: boolean;
  onClose: () => void;
  onChange: (startDate:string, endDate: string) => void;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // States for the inputs
  const [startDate, setStartDate] = useState(new Date(moment().day(-7).format('YYYY-MM-DD')))
  const [endDate, setEndDate] = useState(new Date(moment().day(-1).format('YYYY-MM-DD')))

  // Event handlers
  const onSave = () => {
    props.onClose()
    props.onChange(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>
        {l.title}
      </DialogTitle>
      <DialogContent>
        <DatePicker
          value={startDate}
          onChange={(e) => { setStartDate(e as Date) }}
          label={l.startDate}
          fullWidth
          margin='dense'
        />
        <DatePicker
          value={endDate}
          onChange={(e) => { setEndDate(e as Date) }}
          label={l.endDate}
          fullWidth
          margin='dense'
        />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={onSave}>
          {l.search}
        </Button>
        <Button color='primary' onClick={props.onClose}>
          {lg.btnClose}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
