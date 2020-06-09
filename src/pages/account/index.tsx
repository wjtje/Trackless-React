import React, { useState } from 'react';
import { Typography, makeStyles, ListItemText, List, ListItem, ListItemIcon } from '@material-ui/core';
import { serverUrl, apiKey } from '../../global';
import Skeleton from '@material-ui/lab/Skeleton';
import _ from 'lodash';
import { useFetch } from '../../scripts/ajax';
import ChangePasswordDialog from './changePassword';
import ActiveDevicesDialog from './activeDevices';
import EditUserDialog from './editUser';
import {
  VpnKey as PasswordIcon,
  GetApp as DownloadIcon,
  Devices as DevicesIcon,
  Edit as EditIcon,
} from '@material-ui/icons';

// Interfaces
export interface UserDetails {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
  group_id:  number;
  groupName: string;
}

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
  const [ devicesDialog, setDevicesDialog ] = useState(false);
  const [ userDialog, setUserDialog ] = useState(false);

  // get the user data
  const [ data, setData ] = useFetch({
    url: `${serverUrl}/user/~`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  const userDetails:UserDetails = _.get(data, 'result[0]', null);

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
        <ListItem button onClick={() => { setDevicesDialog(true); }}>
          <ListItemIcon><DevicesIcon/></ListItemIcon>
          <ListItemText primary="Devices you're logged into"/>
        </ListItem>
        <ListItem button onClick={() => {}}>
          <ListItemIcon><DownloadIcon/></ListItemIcon>
          <ListItemText primary="Download my details"/>
        </ListItem>
        <ListItem button onClick={() => { setUserDialog(true); }}>
          <ListItemIcon><EditIcon/></ListItemIcon>
          <ListItemText primary="Edit your info"/>
        </ListItem>
      </List>

      <ChangePasswordDialog open={passwordDialog} onClose={setPasswordDialog}/>
      <ActiveDevicesDialog open={devicesDialog} onClose={setDevicesDialog}/>
      <EditUserDialog open={userDialog} onClose={setUserDialog} updateUser={setData}/>
    </main>
  )
}

// Export the page
export default Page;