import React, { useState } from "react";
import { Link, withRouter} from "react-router-dom";
import { AppBar, Toolbar, Drawer, IconButton, Typography, List, Divider, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  Menu as MenuIcon,
} from '@material-ui/icons';
import { useFetch } from "../../scripts/ajax";
import _ from 'lodash';
import { serverUrl, auth } from "../../global";
import { menuOptions, useStyles } from "./const";
import { menuOption } from "./interfaces";

function Header() {
  const classes = useStyles();

  // Define states
  const [menuState, setMenuState] = useState(false);  // Is the Drawer / Menu open?

  // Get the access rules from the server
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