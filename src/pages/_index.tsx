import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Shell from '../pages/_shell';
import { Typography } from '@material-ui/core';

// Import pages
import homePage from './home';
import settingsPage from './settings';

export function ReactApp() {
  return (
    <Shell
      title="Trackless - Beta"
      pages={[
        homePage,
        settingsPage
      ]}
    />
  )
}