import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, makeStyles, useTheme, useMediaQuery, MenuItem, Select, IconButton } from '@material-ui/core';
import { serverUrl, auth } from '../../global';
import { useSnackbar } from 'notistack';
import $ from 'jquery';
import { useFetch } from '../../scripts/ajax';
import _ from 'lodash';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';
import {
  Delete as DeleteIcon
} from '@material-ui/icons';

// Interfaces
export interface Location {
  location_id: number;
  name:        string;
  place:       string;
  id:          string;
}

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
  },
  headerIcon: {
    float: 'right'
  },
}));

export default function EditDialog(props: {
  open: boolean;
  onClose: (state: boolean) => void;
  update: (state: string) => void;
  work: {
    work_id: number;
    location: {
      location_id: number;
    }
    time: number | string;
    date: string;
    description: string;
  };
}) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  // Get all the locations
  const locations:Array<Location> = _.get(useFetch({
    url: `${serverUrl}/location`,
    method: 'get',
    ...auth
  })[0], 'result', []);

  // States
  const [locationId, setLocationId] = useState(0);
  const [time, setTime] = useState("0");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");

  // Update states when work changes
  useEffect(() => {
    setLocationId(props.work.location.location_id);
    setTime(String(props.work.time));
    setDate(new Date(props.work.date));
    setDescription(props.work.description);
  }, [props.work]);

  // Create handlers
  const handleClose = () => {
    props.onClose(false);
  }

  const handleSave = () => {
    props.onClose(false);

    //TODO: patch command
  }

  const handleRemove = () => {
    props.onClose(false);  // Close the dialog

    // Remove from the server
    $.ajax({
      url: `${serverUrl}/work/user/~/${props.work.work_id}`,
      method: 'delete',
      ...auth,
    }).done(() => {
      props.update(new Date().toISOString())
      enqueueSnackbar("Your changes has been saved", {
        variant: "success"
      });
    });
  }

  return (
    <Dialog open={props.open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle>
        Change work details
        <IconButton className={classes.headerIcon} onClick={handleRemove}>
          <DeleteIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Select
          value={locationId}
          onChange={e => setLocationId(Number(e.target.value))}
          error={locationId === 0}
          fullWidth
        >
          <MenuItem value={0}>Please select a location</MenuItem>
          {locations.map((i) => (
            <MenuItem value={i.location_id} key={i.location_id}>{i.place} - {i.name}</MenuItem>
          ))}
        </Select>

        <TextField
          value={time}
          onChange={e => setTime(e.target.value)}
          label="Time"
          type="text"
          fullWidth
          className={classes.spacing}
          error={(function () {
            // Test if the string is correct
            return !/(^[0-9]{1}|^1[0-9]{1})($|[.,][0-9]{1,2}$)/.test(time)
          })()}
        />

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            value={date}
            onChange={setDate}
            label="Date"
            fullWidth
            className={classes.spacing}
          />
        </MuiPickersUtilsProvider>

        <TextField
          value={description}
          onChange={e => setDescription(e.target.value)}
          label="Description"
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