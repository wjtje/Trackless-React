import React from 'react';
import tracklessTheme from '../style/theme';
import { ThemeProvider, Container, Avatar, makeStyles, Typography, Button, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import LockIcon from '@material-ui/icons/Lock';
import $ from 'jquery';
import { serverUrl } from '../global';

// Define custom style
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function () {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();

  const singIn = () => {
    // Get the data
    const username = ($('#username')[0] as HTMLInputElement).value;
    const password = ($('#password')[0] as HTMLInputElement).value;
    const deviceName = ($('#devicename')[0] as HTMLInputElement).value;

    // Send it to the server
    $.ajax({
      url: serverUrl + '/api',
      method: 'POST',
      data: {
        username: username,
        password: password,
        deviceName: deviceName
      }
    }).done((result) => {
      console.log(JSON.parse(result));
      // Save api key
      localStorage.setItem('apiKey', JSON.parse(result).bearer);
      location.reload();
    }).fail((result) => {
      // Trow error
      const error = JSON.parse(result.responseText);
      enqueueSnackbar(error.message, {
        variant: "error"
      })
    });
  };

  return (
    <ThemeProvider theme={tracklessTheme}>
      <Container maxWidth="sm" className={classes.root} component="main">
        <Avatar className={classes.avatar}>
          <LockIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="devicename"
            label="Device name"
            id="devicename"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={singIn}
            >
            Sign In
          </Button>
        </form>
      </Container>
    </ThemeProvider>
  )
};