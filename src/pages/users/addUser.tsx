import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { serverUrl, auth } from "../../global";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, makeStyles, TextField, InputLabel, Select, MenuItem } from "@material-ui/core";
import $ from 'jquery';
import { useFetch } from "../../scripts/ajax";
import _ from "lodash";

// Interfaces
export interface UserDetails {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
  group_id:  number;
  groupName: string;
}

// Define custom style
const useStyles = makeStyles((theme) => ({
  spacing: {
    marginTop: theme.spacing(2),
  },
  maxWidth: {
    width: '100%'
  }
}));

export default function AddUserDialog(props: {
  open: boolean;
  onClose: (state: boolean) => void;
  userDetails: Array<UserDetails>;
  update: (state: number) => void;
}) {
  const { open, onClose } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [ values, setValues ] = useState({
    firstname: '',
    lastname: '',
    username: '',
    group_id: 0,
    firstPassword: '',
    secondPassword: '',
  });

  // Clean form
  useEffect(() => {
    setTimeout(() => {
      setValues({
        firstname: '',
        lastname: '',
        username: '',
        group_id: 0,
        firstPassword: '',
        secondPassword: '',
      });
    }, 750)
  }, [open])

  // Get all the group info
  const group = _.get(useFetch({
    url: `${serverUrl}/group`,
    method: 'get',
    ...auth
  })[0], 'result', []);

  // Create handlers
  const handleClose = () => {
    onClose(false); // Close the dialog
  }

  const handleChange = (key: string) => {
    return function(e) {
      values[key] = e.target.value;

      setValues({
        ...values
      });
    }
  }

  const handleSave = () => {
    onClose(false);  // Close the dialog

    // Push the changes to the server
    $.ajax({
      url: `${serverUrl}/user`,
      method: "post",
      ...auth,
      data: {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        password: values.firstPassword,
        group_id: Number(values.group_id)
      }
    }).done((data) => {
      props.update(data.user_id);
      enqueueSnackbar("Your changes has been saved", {
        variant: "success"
      });
    }).fail((result) => {
      enqueueSnackbar(`Could not save the changes! (${JSON.parse(result.responseText).message})`, {
        variant: "warning"
      });
    });
  }

  // Render page
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>User details</DialogTitle>
      <DialogContent>
        <TextField
          value={values.firstname}
          onChange={handleChange('firstname')}
          label="Firstname"
          type="text"
          fullWidth
        />

        <TextField
          value={values.lastname}
          onChange={handleChange('lastname')}
          label="Lastname"
          type="text"
          fullWidth
          className={classes.spacing}
        />

        <TextField
          value={values.username}
          onChange={handleChange('username')}
          label="Username"
          type="text"
          fullWidth
          className={classes.spacing}
          error={_.findIndex(props.userDetails, ['username', values.username]) != -1}
        />

        <InputLabel shrink id="select-group" className={classes.spacing}>Group</InputLabel>
        <Select
          labelId="select-group"
          value={values.group_id}
          className={classes.maxWidth}
          onChange={handleChange('group_id')}
        >
          {
            group.map((i) => (
              <MenuItem value={i.group_id} key={i.group_id}>{i.groupName}</MenuItem>
            ))
          }
        </Select>

        <TextField
          value={values.firstPassword}
          onChange={handleChange('firstPassword')}
          label="Password"
          type="password"
          id="pass"
          fullWidth
          className={classes.spacing}
        />

        <TextField
          value={values.secondPassword}
          onChange={handleChange('secondPassword')}
          label="Repeat password"
          type="password"
          fullWidth
          className={classes.spacing}
          error={values.firstPassword != values.secondPassword}
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
  );
}