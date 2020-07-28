import React, { useState } from "react";
import { Link, withRouter} from "react-router-dom";
import { AppBar, Toolbar, Drawer, makeStyles, IconButton, Typography, List, Divider, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  AccountBox as AccountBoxIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  DateRange as DateRangeIcon,
} from '@material-ui/icons';
import { useFetch } from "../scripts/ajax";
import _ from 'lodash';
import { serverUrl, auth } from "../global";

// Define menu options
interface menuOption {
  url: string;
  name: string;
  icon: React.ReactNode;
  access?: Array<{
    method: "get" | "post" | "patch" | "delete";
    url: string;
  }>
}

const menuOptions:Array<menuOption> = [
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
const useStyles = makeStyles((theme) => ({
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

function Header() {
  const classes = useStyles();

  // Define states
  const [menuState, setMenuState] = useState(false);  // Is the Drawer / Menu open?

  const access = _.get(useFetch({
    url: `${serverUrl}/access/group/~`,
    method: "GET",
    ...auth
  })[0], "result", []);

  return (
    <nav>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => {
            setMenuState(true); // Open the Drawer / Menu
          }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Trackless - Client Beta
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={menuState} onClose={() => {setMenuState(false)}}>
        <List className={classes.drawerList}>
          <Typography variant="h6" className={classes.drawerTitle}>Trackless</Typography>
          <Typography variant="body2" className={classes.drawerSubTitle}>Client beta</Typography>
          <Divider/>
          {
            menuOptions.map((i:menuOption) => {
              let haveAccess:boolean = true;

              (_.get(i, 'access', []) as menuOption["access"]).map((j) => {
                if (!access.some(e => ( e.url == j.url && e.method == j.method ))) {
                  haveAccess = false;
                }
              });

              return (
                <Link to={i.url} className={classes.link} key={i.url} hidden={!haveAccess}>
                  <ListItem button onClick={() => {
                    setMenuState(false);          // Close the Drawer / menu
                  }}>
                    <ListItemIcon>
                      {i.icon}
                    </ListItemIcon>
                    <ListItemText primary={i.name}/>
                  </ListItem>
                </Link>
              );
            })
          }
        </List>
      </Drawer>
    </nav>
  );
}

export default withRouter(Header);