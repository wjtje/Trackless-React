import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'
import React from 'react'

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
        Remove
      </DialogTitle>
      <DialogContent>
        Are you sure to remove this?
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={props.onRemove}
        >
          Yes
        </Button>
        <Button
          color='primary'
          onClick={props.onClose}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}
