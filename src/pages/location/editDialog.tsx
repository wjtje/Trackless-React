import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, IconButton, DialogContent, TextField, DialogActions, Button, makeStyles } from '@material-ui/core';
import {
  Delete as DeleteIcon
} from '@material-ui/icons';
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
  headerIcon: {
    float: 'right'
  },
  content: {
    top: -12,
    position: 'relative'
  }
}));

export default function EditDialog(props: {
  open: boolean;
  onClose: (state: boolean) => void;
  location: any;
  update: (state: string) => void;
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [ place, setPlace ] = useState('No place');
  const [ name, setName ] = useState('No name');
  const [ id, setId ] = useState('No id');

  // Update the state when location changes
  useEffect(() => {
    setPlace(props.location.place);
    setName(props.location.name);
    setId(props.location.id);
  }, [props.location])

  // Create handlers
  const handleClose = () => {
    props.onClose(false);
  }

  const handleSave = () => {
    props.onClose(false);

    // Push the changes to the server
    $.ajax({
      url: `${serverUrl}/location/${props.location.location_id}`,
      method: "PATCH",
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

  const handleRemove = () => {
    props.onClose(false);  // Close the dialog

    // Push the changes to the server
    $.ajax({
      url: `${serverUrl}/location/${props.location.location_id}`,
      method: "delete",
      ...auth
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
        Change user details
        <IconButton className={classes.headerIcon} onClick={handleRemove}>
          <DeleteIcon/>
        </IconButton>
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