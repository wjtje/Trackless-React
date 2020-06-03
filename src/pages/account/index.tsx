import React, { useState } from 'react';
import { Typography, makeStyles, ListItemText, List, ListItem, ListItemIcon } from '@material-ui/core';
import { serverUrl } from '../../global';
import Skeleton from '@material-ui/lab/Skeleton';
import _ from 'lodash';
import { useFetch } from '../../scripts/ajax';
import ChangePasswordDialog from './changePassword';
import {
  VpnKey as PasswordIcon,
  GetApp as DownloadIcon,
} from '@material-ui/icons';

const apiKey = localStorage.getItem('apiKey');

// Define custom style
const useStyles = makeStyles((theme) => ({
  td: {
    paddingRight: theme.spacing(2)
  },
  button: {
    display: 'block',
    maxWidth: 400,
    width: '100%',
    marginTop: theme.spacing(2),
  },
  spacing: {
    marginTop: theme.spacing(2),
  }
}));

// Create the page
function Page() {
  const classes = useStyles();

  // Define the states
  const [ passwordDialog, setPasswordDialog ] = useState(false);

  // get the user data
  const userDetails = _.get(useFetch(
    {
      url: serverUrl + '/user/~',
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  ), 'result[0]', null);

  return (
    <main>
      <Typography variant="h5">{(userDetails)? `Welcome ${userDetails.firstname} ${userDetails.lastname}`: <Skeleton/>}</Typography>

      <Typography variant="h6" className={classes.spacing}>Your details</Typography>
      <table>
        <tbody>
          {
            [
              ['Firstname', 'firstname'],
              ['Lastname', 'lastname'],
              ['Username', 'username'],
              ['Group', 'groupName']
            ].map((row) => (
              <tr key={row[1]}>
                <Typography variant="body2" component="td" className={classes.td}>{row[0]}</Typography>
                <td style={{
                  maxWidth: '100%',
                  width: 250
                }}>
                  {(userDetails)? userDetails[row[1]] : <Skeleton variant="text"/>}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <Typography variant="h6" className={classes.spacing}>Options for your account</Typography>
      <List>
        <ListItem button onClick={() => { setPasswordDialog(true); }}>
          <ListItemIcon><PasswordIcon/></ListItemIcon>
          <ListItemText primary="Change my password"/>
        </ListItem>
        <ListItem button onClick={() => {}}>
          <ListItemIcon><DownloadIcon/></ListItemIcon>
          <ListItemText primary="Download my details"/>
        </ListItem>
      </List>

      <ChangePasswordDialog open={passwordDialog} onClose={setPasswordDialog}/>
    </main>
  )
}

// Export the page
export default Page;