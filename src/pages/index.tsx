import React from 'react';

// Interface
interface Page {
  displayName: string;
  displayIcon: React.ReactChild;
  showInMenu: false;
  url: string;
  page: () => JSX.Element;
}

// Storage for all the pages
let pages:Array<Page> = [];

// Push each page to the array
import LoginScreen from './loginScreen';

pages.push({
  displayName: "LoginScreen",
  displayIcon: <span/>,
  showInMenu: false,
  url: '/login',
  page: LoginScreen
});

// Export the array
export default pages;