import React, { useState } from 'react';
import { Home as HomeIcon, Add as AddIcon } from '@material-ui/icons';
import { Typography, ListItemText, List, ListItem, ListSubheader, makeStyles, Fab } from '@material-ui/core';
import { serverUrl } from '../global';
import Skeleton from '@material-ui/lab/Skeleton';
import $ from 'jquery';

const apiKey = localStorage.getItem('apiKey');

// Define custom style
const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: 56 + theme.spacing(2),
  },

  holder: {
    overflow: 'auto',
  },
  table: {
    margin: '0 12px',
  },
  thead: {
    fontWeight: 'bold',
  },
  td: {
    padding: '0',
    paddingRight: theme.spacing(2),
    minWidth: 38,
  },
  tdFirst: {
    padding: 0,
    paddingRight: theme.spacing(2),
    width: 125,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  tr: {
    cursor: 'pointer',
  },

  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

// Create promise
const userInfo = new Promise((resolve, reject) => {
  $.ajax({
    url: serverUrl + '/user/~',
    method: "GET",
    data: {
      apiKey: apiKey
    },
  }).done(resolve).fail((errorResult) => {
    console.log(JSON.parse(errorResult.responseText));
    reject(JSON.parse(errorResult.responseText));
  });
});

// Create the page
function Page() {
  const classes = useStyles();

  // States
  const [welcomeUser, setWelcomeUser] = useState(undefined);

  // Get the user info
  userInfo.then((response: any) => {
    setWelcomeUser(`What have you done today ${JSON.parse(response).result[0].firstname} ${JSON.parse(response).result[0].lastname}?`);
  });

  return (
    <main className={classes.root}>
      <Typography variant="h5">What have you done today?</Typography>
      <Typography variant="subtitle1">Suggestions</Typography>

      <List>
        <ListItem button>
          <ListItemText primary="Fam. De Vries" secondary="Location"/>
        </ListItem>
        <ListItem button>
          <ListItemText primary="Fam. Hoogkamp" secondary="Location"/>
        </ListItem>
      </List>

      <div className={classes.holder}>
        <table>
          <thead>
            <tr className={classes.thead}>
              <td className={classes.tdFirst}><Typography variant="subtitle1" style={{fontWeight: 'bold'}}>Project</Typography></td>
              <td className={classes.td}><Typography variant="subtitle1" style={{fontWeight: 'bold'}}>Tijd</Typography></td>
              <td className={classes.td}><Typography variant="subtitle1" style={{fontWeight: 'bold'}}>Opmerkingen</Typography></td>
            </tr>
          </thead>
          <tbody>
            <tr className={classes.tr}>
              <Typography variant="body2" component="td" className={classes.tdFirst}>Project home</Typography>
              <Typography variant="body2" component="td" className={classes.td}>2 uur</Typography>
              <Typography variant="body2" component="td" className={classes.td}>No idea</Typography>
            </tr>
          </tbody>
        </table>
      </div>

      <Fab color="primary" aria-label="add" className={classes.fab}>
        <AddIcon />
      </Fab>
    </main>
  )
}

// Export the page
export default {
  name: 'Home',
  icon: <HomeIcon/>,
  showInMenu: true,
  url: '#/home',
  page: <Page/>
}