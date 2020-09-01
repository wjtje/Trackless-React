// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core'
import { systemEmail } from '../../../global'

export default function DownloadDetails (props: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>
        Download details
      </DialogTitle>
      <DialogContent>
        If you want to download all the info we have about you.<br />
        Please send your system administrator an email at {systemEmail} with your full name and tell them that you want to see your details.
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={props.onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
