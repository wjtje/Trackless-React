import React, { useState } from "react";
import { Link, withRouter} from "react-router-dom";
import { AppBar, Toolbar, Drawer, makeStyles, IconButton, Typography, List, Divider, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  AccountBox as AccountBoxIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';

// Define menu options
interface menuOption {
  url: string;
  name: string;
  icon: React.ReactNode;
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
            menuOptions.map((i) => (
              <Link to={i.url} className={classes.link} key={i.url}>
                <ListItem button onClick={() => {
                  setMenuState(false);          // Close the Drawer / menu
                }}>
                  <ListItemIcon>
                    {i.icon}
                  </ListItemIcon>
                  <ListItemText primary={i.name}/>
                </ListItem>
              </Link>
            ))
          }
        </List>
      </Drawer>
    </nav>
  );
}

export default withRouter(Header);