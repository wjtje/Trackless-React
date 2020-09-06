import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'
import React from 'react'
import language from '../../language'

const l = language.removeDialog
const lg = language.global

export default function RemoveDialog (props: {
  open: boolean;
  onClose: () => void;
  onRemove: () => void;
}) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>
        {l.title}
      </DialogTitle>
      <DialogContent>
        {l.content}
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={props.onRemove}
        >
          {lg.yes}
        </Button>
        <Button
          color='primary'
          onClick={props.onClose}
        >
          {lg.no}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
