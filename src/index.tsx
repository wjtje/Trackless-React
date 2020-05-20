import React from 'react';
import ReactDOM from 'react-dom';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import $ from 'jquery';
import { useStyles } from './styles';
import theme from './theme';

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Title
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </div>
  )
}

ReactDOM.render(
  <App/>,
  $('div[data-type="main"]')[0]
)