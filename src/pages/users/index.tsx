import React, { useState } from 'react';
import { ListItem, ListItemText, List, ListSubheader, makeStyles, Fab } from '@material-ui/core';
import { serverUrl, auth } from '../../global';
import _ from 'lodash';
import { useFetch } from '../../scripts/ajax';
import Skeleton from '@material-ui/lab/Skeleton';
import EditUserDialog from './editUser';
import { Add as AddIcon } from '@material-ui/icons';
import AddUserDialog from './addUser';

const useStyle = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

// Create the page
function Page() {
  const classes = useStyle();

  const [ editOpen, setEditOpen ] = useState(false);
  const [ addOpen, setAddOpen ] = useState(false);
  const [ activeUserId, setActiveUserId ] = useState(0);
  const [ updateId, setUpdateId ] = useState(0);
  
  const [ usersState, setUsersState ] = useFetch({
    url: `${serverUrl}/user`,
    method: 'get',
    ...auth,
    data: {
      update: updateId
    }
  });

  const users = _.get(usersState, 'result', []);

  return (
    <main>
      <List subheader={<ListSubheader>Users</ListSubheader>}>
        {
          (users.length == 0)? <ListItem><ListItemText primary={<Skeleton variant="text"/>} secondary={<Skeleton variant="text"/>}/></ListItem>:users.map((user) => (
            <ListItem button key={user.user_id} onClick={() => {
              setEditOpen(true);
              setActiveUserId(user.user_id);
            }}>
              <ListItemText primary={`${user.firstname} ${user.lastname}`} secondary={`${user.groupName} (${user.username})`}/>
            </ListItem>
          ))
        }
      </List>

      <Fab className={classes.fab} color="primary" aria-label="add" onClick={() => {
        setAddOpen(true);
      }}>
        <AddIcon/>
      </Fab>

      <EditUserDialog open={editOpen} onClose={setEditOpen} updateState={setUsersState} userDetails={users} user_id={activeUserId} update={setUpdateId}/>
      <AddUserDialog open={addOpen} onClose={setAddOpen} userDetails={users} update={setUpdateId}/>
    </main>
  )
}

// Export the page
export default Page;