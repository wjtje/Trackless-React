import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { serverUrl, apiKey } from "../../global";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, makeStyles } from "@material-ui/core";
import $ from 'jquery';

// Define custom style
const useStyles = makeStyles((theme) => ({
  spacing: {
    marginTop: theme.spacing(2),
  }
}));

export default function ChangePasswordDialog(props: {
  open: boolean;
  onClose: (state: boolean) => void;
}) {
  const { open, onClose } = props;
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  // Define custom states
  const [firstPassword, setFirstPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');

  const handleClose = () => {
    onClose(false); // Close the dialog
  }

  const handleSave = () => {
    if (firstPassword != secondPassword) {
      enqueueSnackbar("Your passwords are not the same!", {
        variant: "warning"
      });
    } else {
      handleClose();
      // Start saving the change
      $.ajax({
        url: serverUrl + '/user/~',
        method: "patch",
        data: {
          password: firstPassword
        },
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }).done(() => {
        enqueueSnackbar("Your password has been changed", {
          variant: "success"
        });
      }).fail(() => {
        enqueueSnackbar("Your password could not be saved!", {
          variant: "warning"
        });
      })
    }
  }

  const changeFirstPassword = (e) => {
    setFirstPassword(e.target.value);
  }

  const changeSecondPassword = (e) => {
    setSecondPassword(e.target.value);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change your password</DialogTitle>
      <DialogContent>
        <TextField
          value={firstPassword}
          onChange={changeFirstPassword}
          label="Password"
          type="password"
          fullWidth
        />
        <TextField
          value={secondPassword}
          onChange={changeSecondPassword}
          label="Confirmation"
          type="password"
          error={firstPassword!=secondPassword}
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