// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core'
import language from '../../../language'

const l = language.downloadDetailsDialog
const lg = language.global

export default function DownloadDetails (props: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>
        {l.title}
      </DialogTitle>
      <DialogContent>
        {l.content}
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={props.onClose}>
          {lg.btnClose}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
