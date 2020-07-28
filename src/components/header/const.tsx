import React from 'react';
import {
  Home as HomeIcon,
  AccountBox as AccountBoxIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  DateRange as DateRangeIcon,
} from '@material-ui/icons';
import { menuOption } from './interfaces';
import { makeStyles } from '@material-ui/core/styles';

// Menu options
export const menuOptions:menuOption[] = [
  {
    url: '/',
    name: 'Home',
    icon: <HomeIcon/>,
    access: [
      {method: "get", url: "/work/user/~/date/:start/:end"},
      {method: "get", url: "/location"},
      {method: "post", url: "/work"},
      {method: "patch", url: "/work/user/~/:work_id"},
      {method: "delete", url: "/work/user/~/:work_id"},
      {method: "get", url: "/location/user/~/last"},
      {method: "get", url: "/work/user/~/:work_id"},
      {method: "get", url: "/location/user/~/most"},
    ]
  },
  {
    url: '/thisWeek',
    name: 'This week',
    icon: <DateRangeIcon/>,
    access: [
      {method: "get", url: "/work/user/~/date/:start/:end"},
      {method: "get", url: "/location"},
      {method: "post", url: "/work"},
      {method: "patch", url: "/work/user/~/:work_id"},
      {method: "delete", url: "/work/user/~/:work_id"},
      {method: "get", url: "/location/user/~/last"},
      {method: "get", url: "/work/user/~/:work_id"},
    ]
  },
  {
    url: '/account',
    name: 'Account',
    icon: <AccountBoxIcon/>,
    access: [
      {method: "get", url: "/user/~"},
      {method: "patch", url: "/user/~"},
      {method: "get", url: "/api"},
      {method: "delete", url: "/api/:api_id"}
    ]
  },
  {
    url: '/users',
    name: 'Users',
    icon: <PersonIcon/>,
    access: [
      {url: '/user', method: 'get'},
      {url: '/user', method: 'post'},
      {url: '/user/:user_id', method: 'patch'},
      {url: '/user/:user_id', method: 'delete'},
      {url: '/group', method: 'get'},
      {url: '/group/:group_id/add/:user_id', method: 'post'},
    ]
  },
  {
    url: '/group',
    name: 'Groups',
    icon: <GroupIcon/>,
    access: [
      {url: '/group', method: 'get'},
    ]
  },
  {
    url: '/location',
    name: 'Location',
    icon: <LocationIcon/>,
    access: [
      {url: '/location', method: 'get'},
      {url: '/location', method: 'post'},
      {url: '/location/:location_id', method: 'patch'},
      {url: '/location/:location_id', method: 'delete'},
    ]
  },
  {
    url: '/settings',
    name: 'Settings',
    icon: <SettingsIcon/>,
  },
]

// Define custom style
export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  // Header
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  // Drawer
  drawerList: {
    width: 250,
  },
  drawerTitle: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  drawerSubTitle: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  // Link
  link: {
    textDecoration: 'none',
    color: '#000'
  },
  // Main content
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));