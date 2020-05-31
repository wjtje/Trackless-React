import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Shell from '../pages/_shell';
import { Typography } from '@material-ui/core';

// Import pages
import homePage from './home';
import settingsPage from './settings';
import accountPage from './account';

export function ReactApp() {
  return (
    <Shell
      title="Trackless - Beta"
      pages={[
        homePage,
        accountPage,
        settingsPage,
      ]}
    />
  )
}