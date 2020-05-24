import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

// Import app
import { ReactApp } from '../pages/_index';
import LoginScreen from '../pages/login';
import { SnackbarProvider } from 'notistack';

// Check if the app is loged in
if (localStorage.getItem('apiKey') == undefined || localStorage.getItem('apiKey') == "undefined") {
  // Render login screen
  ReactDOM.render(
    <SnackbarProvider maxSnack={3}><LoginScreen/></SnackbarProvider>,
    $('div[data-type="main"]')[0]
  );
} else {
  // Open default page
  history.replaceState(null, 'Home', '#/home');

  // Render app
  ReactDOM.render(
    <ReactApp/>,
    $('div[data-type="main"]')[0]
  )
}