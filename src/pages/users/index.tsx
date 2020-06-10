import React from 'react';
import { ListItem, ListItemText, List, ListSubheader } from '@material-ui/core';
import { serverUrl, auth } from '../../global';
import _ from 'lodash';
import { useFetch } from '../../scripts/ajax';
import Skeleton from '@material-ui/lab/Skeleton';

// Create the page
function Page() {
  const users = _.get(useFetch({
    url: `${serverUrl}/user`,
    method: 'get',
    ...auth
  })[0], 'result', []);

  return (
    <main>
      <List subheader={<ListSubheader>Users</ListSubheader>}>
        {
          (users.length == 0)? <ListItem><ListItemText primary={<Skeleton variant="text"/>} secondary={<Skeleton variant="text"/>}/></ListItem>:users.map((user) => (
            <ListItem button key={user.user_id}>
              <ListItemText primary={`${user.firstname} ${user.lastname}`} secondary={user.groupName}/>
            </ListItem>
          ))
        }
      </List>
    </main>
  )
}

// Export the page
export default Page;