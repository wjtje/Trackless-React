import { useSnackbar } from "notistack";
import React from "react";
import { serverUrl, apiKey, auth } from "../../global";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, makeStyles, useTheme, useMediaQuery } from "@material-ui/core";
import $ from 'jquery';
import _ from 'lodash';
import { useFetch } from "../../scripts/ajax";

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
  }
}));

export default function EditUserDialog(props: {
  open: boolean;
  onClose: (state: boolean) => void;
  updateUser: (state: any) => void;
}) {
  const { open, onClose } = props;
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  // Get the userdata
  const [ data, setData ] = useFetch({
    url: `${serverUrl}/user/~`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  const userDetails:UserDetails = _.get(data, 'result[0]', []);

  // Create handlers
  const handleClose = () => {
    onClose(false); // Close the dialog
  }

  const handleChange = (key: string) => {
    return function(e) {
      userDetails[key] = e.target.value;

      // Update the state
      setData({
        ...data,
        result: [
          userDetails
        ]
      });
    }
  }

  const handleSave = () => {
    handleClose();  // Close dialog
    
    // Push to the server
    $.ajax({
      url: `${serverUrl}/user/~`,
      method: "PATCH",
      ...auth,
      data: {
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        username: userDetails.username,
      }
    }).done(() => {
      // Update account page
      props.updateUser({
        ...data,
        result: [
          userDetails
        ]
      });

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
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle>Change user details</DialogTitle>
      <DialogContent>
        <TextField
          value={userDetails.firstname}
          onChange={handleChange('firstname')}
          label="Firstname"
          type="text"
          fullWidth
        />
        <TextField
          value={userDetails.lastname}
          onChange={handleChange('lastname')}
          label="Lastname"
          type="text"
          fullWidth
          className={classes.spacing}
        />
        <TextField
          value={userDetails.username}
          onChange={handleChange('username')}
          label="Username"
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
  );
}