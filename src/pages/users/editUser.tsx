import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { serverUrl, auth } from "../../global";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, makeStyles, Select, InputLabel, MenuItem } from "@material-ui/core";
import $ from 'jquery';
import _ from 'lodash';
import { useFetch } from "../../scripts/ajax";

let backup = [];

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

export default function EditUserDialog(props: {
  open: boolean;
  onClose: (state: boolean) => void;
  userDetails: Array<UserDetails>;
  user_id: number;
  updateState: (state: any) => void;
}) {
  const { open, onClose } = props;
  const classes = useStyles();

  const userIndex = _.findIndex(props.userDetails, ['user_id', props.user_id]);
  const { enqueueSnackbar } = useSnackbar();

  // Get all the group info
  const group = _.get(useFetch({
    url: `${serverUrl}/group`,
    method: 'get',
    ...auth
  })[0], 'result', []);

  console.log(group);

  // Safe the state
  useEffect(() => {
    if (backup.length == 0) {
      backup = _.cloneDeep(props.userDetails);  // Clone the array
    }
  }, [props.userDetails]);

  // Create handlers
  const handleClose = () => {
    onClose(false); // Close the dialog

    // Reset the state
    props.updateState({
      result: backup
    });
  }

  const handleChange = (key: string) => {
    return function(e) {
      props.userDetails[userIndex][key] = e.target.value;
      props.userDetails[userIndex].groupName = group[_.findIndex(group, ['group_id', props.userDetails[userIndex].group_id])].groupName;

      props.updateState({
        result: props.userDetails
      })
    }
  }

  const handleSave = () => {
    onClose(false);  // Close the dialog

    // Make a new backup
    backup = _.cloneDeep(props.userDetails);

    // Push the changes to the server
    $.ajax({
      url: `${serverUrl}/user/${props.user_id}`,
      method: "PATCH",
      ...auth,
      data: {
        firstname: props.userDetails[userIndex].firstname,
        lastname: props.userDetails[userIndex].lastname,
        username: props.userDetails[userIndex].username,
      }
    }).done(() => {
      enqueueSnackbar("Your changes has been saved", {
        variant: "success"
      });
    }).fail((result) => {
      enqueueSnackbar(`Could not save the changes! (${JSON.parse(result.responseText).message})`, {
        variant: "warning"
      });
    });

    // Change the group
    $.ajax({
      url: `${serverUrl}/group/${props.userDetails[userIndex].group_id}/${props.userDetails[userIndex].user_id}`,
      method: 'post',
      ...auth
    }).fail((result) => {
      enqueueSnackbar(`Could not save the changes! (${JSON.parse(result.responseText).message})`, {
        variant: "warning"
      });
    });
  }

  // Render page
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change user details</DialogTitle>
      <DialogContent>
        <TextField
          value={_.get(props.userDetails[userIndex], 'firstname', 'No firstname')}
          onChange={handleChange('firstname')}
          label="Firstname"
          type="text"
          fullWidth
        />
        <TextField
          value={_.get(props.userDetails[userIndex], 'lastname', 'No lastname')}
          onChange={handleChange('lastname')}
          label="Lastname"
          type="text"
          fullWidth
          className={classes.spacing}
        />
        <TextField
          value={_.get(props.userDetails[userIndex], 'username', 'No username')}
          onChange={handleChange('username')}
          label="Username"
          type="text"
          fullWidth
          className={classes.spacing}
        />
        <InputLabel shrink id="select-group" className={classes.spacing}>Group</InputLabel>
        <Select
          labelId="select-group"
          value={_.get(props.userDetails[userIndex], 'group_id', 0)}
          className={classes.maxWidth}
          onChange={handleChange('group_id')}
        >
          {
            group.map((i) => (
              <MenuItem value={i.group_id} key={i.group_id}>{i.groupName}</MenuItem>
            ))
          }
        </Select>
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