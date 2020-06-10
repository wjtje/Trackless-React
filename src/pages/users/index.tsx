import React, { useState } from 'react';
import { ListItem, ListItemText, List, ListSubheader } from '@material-ui/core';
import { serverUrl, auth } from '../../global';
import _ from 'lodash';
import { useFetch } from '../../scripts/ajax';
import Skeleton from '@material-ui/lab/Skeleton';
import EditUserDialog from './editUser';

// Create the page
function Page() {
  const [ open, setOpen ] = useState(false);
  const [ activeUserId, setActiveUserId ] = useState(0);
  
  const [ usersState, setUsersState ] = useFetch({
    url: `${serverUrl}/user`,
    method: 'get',
    ...auth
  });

  const users = _.get(usersState, 'result', []);

  return (
    <main>
      <List subheader={<ListSubheader>Users</ListSubheader>}>
        {
          (users.length == 0)? <ListItem><ListItemText primary={<Skeleton variant="text"/>} secondary={<Skeleton variant="text"/>}/></ListItem>:users.map((user) => (
            <ListItem button key={user.user_id} onClick={() => {
              setOpen(true);
              setActiveUserId(user.user_id);
            }}>
              <ListItemText primary={`${user.firstname} ${user.lastname}`} secondary={`${user.groupName} (${user.username})`}/>
            </ListItem>
          ))
        }
      </List>

      <EditUserDialog open={open} onClose={setOpen} updateState={setUsersState} userDetails={users} user_id={activeUserId}/>
    </main>
  )
}

// Export the page
export default Page;