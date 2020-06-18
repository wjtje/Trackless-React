import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, makeStyles } from '@material-ui/core';
import { serverUrl, auth } from '../../global';
import { useSnackbar } from 'notistack';
import $ from 'jquery';

// Define custom style
const useStyles = makeStyles((theme) => ({
  spacing: {
    marginTop: theme.spacing(2),
  },
  maxWidth: {
    width: '100%'
  },
  content: {
    top: -12,
    position: 'relative'
  }
}));

export default function EditDialog(props: {
  open: boolean;
  onClose: (state: boolean) => void;
  update: (state: string) => void;
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [ place, setPlace ] = useState('');
  const [ name, setName ] = useState('');
  const [ id, setId ] = useState('');

  // Create handlers
  const handleClose = () => {
    props.onClose(false);
  }

  const handleSave = () => {
    props.onClose(false);

    $.ajax({
      url: `${serverUrl}/location`,
      method: 'post',
      ...auth,
      data: {
        place: place,
        name: name,
        id: id
      }
    }).done(() => {
      enqueueSnackbar("Your changes has been saved", {
        variant: "success"
      });
      props.update(new Date().toISOString());
    }).fail((result) => {
      enqueueSnackbar(`Could not save the changes! (${JSON.parse(result.responseText).message})`, {
        variant: "warning"
      });
    });
  }

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>
        Add a location
      </DialogTitle>
      <DialogContent className={classes.content}>
        <TextField
          value={place}
          onChange={e => setPlace(e.target.value)}
          label="Place"
          type="text"
          fullWidth
        />
        <TextField
          value={name}
          onChange={e => setName(e.target.value)}
          label="Name"
          type="text"
          fullWidth
          className={classes.spacing}
        />
        <TextField
          value={id}
          onChange={e => setId(e.target.value)}
          label="Id"
          type="text"
          fullWidth
          className={classes.spacing}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}