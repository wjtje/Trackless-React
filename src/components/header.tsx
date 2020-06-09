import React, { useState } from "react";
import { Link, withRouter} from "react-router-dom";
import { AppBar, Toolbar, Drawer, makeStyles, IconButton, Typography, List, Divider, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  AccountBox as AccountBoxIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import { useFetch } from "../scripts/ajax";
import _ from 'lodash';
import { serverUrl, apiKey } from "../global";

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
  },
  {
    url: '/account',
    name: 'Account',
    icon: <AccountBoxIcon/>,
    access: [
      {method: "get", url: "/user/~"},
      {method: "post", url: "/user/~"},
      {method: "get", url: "/api"},
      {method: "delete", url: "/api/:api_id"}
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
    url: `${serverUrl}/access/~`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
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