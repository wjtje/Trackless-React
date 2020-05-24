import React, { useState } from 'react';
import tracklessTheme from '../style/theme';
import { ThemeProvider, AppBar, Toolbar, Typography, makeStyles, IconButton, Drawer, List, Divider, Container, ListItemText, ListItem, ListItemIcon, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

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
  // Main content
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

// Define component
export default function Shell(props) {
  const classes = useStyles();

  // Define states
  const [menuState, setMenuState] = useState(false);  // Is the Drawer / Menu open?
  const [activePage, setActivePage] = useState('#/home'); // Default page

  // History
  window.onpopstate = () => {
    setActivePage(location.hash);
  }

  return (
    <ThemeProvider theme={tracklessTheme}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => {
            setMenuState(true); // Open the Drawer / Menu
          }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Drawer / Menu */}
      <Drawer anchor="left" open={menuState} onClose={() => {setMenuState(false)}}>
          <List className={classes.drawerList}>
            <Typography variant="h6" className={classes.drawerTitle}>Trackless</Typography>
            <Typography variant="body2" className={classes.drawerSubTitle}>Client beta</Typography>
            <Divider/>
            {props.pages.map((menuItem) => {
              if (menuItem.showInMenu) {
                return (
                  <ListItem button key={menuItem.name} onClick={() => {
                    setActivePage(menuItem.url);  // Move to the other page
                    setMenuState(false);          // Close the Drawer / menu
                    history.pushState({}, menuItem.name, menuItem.url);   // Push to history
                  }}>
                    <ListItemIcon>
                      {menuItem.icon}
                    </ListItemIcon>
                    <ListItemText primary={menuItem.name}/>
                  </ListItem>
                )
              }
            })}
          </List>
      </Drawer>
      {/* Pages */}
      <Container component="main" className={classes.main}>
        {props.pages.map((pageItem) => (
          <Typography component="div" hidden={pageItem.url != activePage} key={pageItem.url}>
            {pageItem.page}
          </Typography>
        ))}
      </Container>
    </ThemeProvider>
  )
}