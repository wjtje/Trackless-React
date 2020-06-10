import React from "react";
import Header from './components/header';
import { SnackbarProvider } from "notistack";
import tracklessTheme from './style/theme';
import { ThemeProvider, Typography, makeStyles, Container } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Login from './pages/login';
import Home from './pages/home';
import Account from './pages/account';
import Users from './pages/users';
import Settings from './pages/settings';

// Define custom style
const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

function App() {
  const classes = useStyles();
  const locationPath = location.pathname;

  return (
    <Router>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={tracklessTheme}>
          <Header/>
          <Container className={classes.main}>
            <Typography component="div">
              <Switch>
                <Route path="/login" exact component={() => <Login/>}/>

                <Route path="/" exact component={() => <Home/>}/>
                <Route path="/account" exact component={() => <Account/>}/>
                <Route path="/users" exact component={() => <Users/>}/>
                <Route path="/settings" exact component={() => <Settings/>}/>
              </Switch>

              {
                // Auto redirect to login screen and back to the home screen
                (
                  localStorage.getItem('apiKey') == undefined ||
                  localStorage.getItem('apiKey') == "undefined"
                )? <Redirect to="/login"/>:null
              }
              {
                (
                  localStorage.getItem('apiKey') != undefined &&
                  localStorage.getItem('apiKey') != "undefined" &&
                  locationPath == "/login"
                )? <Redirect to="/"/>:null
              }
            </Typography>
          </Container>
        </ThemeProvider>
      </SnackbarProvider>
    </Router>
  );
}

export default App;