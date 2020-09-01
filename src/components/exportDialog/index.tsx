// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core'
import useStyles from './useStyles'
import DateFnsUtils from '@date-io/date-fns'
import {
  DatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import moment from 'moment'
import { useSnackbar } from 'notistack'

export default function ExportDialog (props: {
  open: boolean;
  onClose: () => void;
  onExport: (startDate:string, endDate: string) => void;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  // States for the inputs
  const [startDate, setStartDate] = useState(new Date(moment().day(-7).format('YYYY-MM-DD')))
  const [endDate, setEndDate] = useState(new Date(moment().day(-1).format('YYYY-MM-DD')))

  // Event handlers
  const onSave = () => {
    props.onClose()
    props.onExport(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))

    // Show a toast
    enqueueSnackbar('Started downloading', {
      variant: 'success',
      autoHideDuration: 2000
    })
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>
        Export to pdf
      </DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            value={startDate}
            onChange={(e) => { setStartDate(e as Date) }}
            label='Start date'
            fullWidth
            className={classes.spacing}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            value={endDate}
            onChange={(e) => { setEndDate(e as Date) }}
            label='End date'
            fullWidth
            className={classes.spacing}
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={onSave}>
          Download
        </Button>
        <Button color='primary' onClick={props.onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
