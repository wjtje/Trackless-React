import React from 'react';
import { ListItem, ListItemText, List, ListSubheader, makeStyles, Fab } from '@material-ui/core';
import { serverUrl, auth } from '../../global';
import _ from 'lodash';
import { useFetch } from '../../scripts/ajax';
import Skeleton from '@material-ui/lab/Skeleton';
import { Add as AddIcon } from '@material-ui/icons';

// Interfaces
export interface Group {
  group_id:  number;
  groupName: string;
  users:     User[];
}

export interface User {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
}

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
  
  const [ groupState ] = useFetch({
    url: `${serverUrl}/group`,
    method: 'get',
    ...auth,
  });

  const groups:Array<Group> = _.get(groupState, 'result', []);

  return (
    <main>
      <List subheader={<ListSubheader>Groups</ListSubheader>}>
        {
          (groups.length == 0)? <ListItem><ListItemText primary={<Skeleton variant="text"/>} secondary={<Skeleton variant="text"/>}/></ListItem>:groups.map((group) => (
            <ListItem key={group.group_id} onClick={() => {
            }}>
              <ListItemText primary={group.groupName} secondary={`Users: ${group.users.length}`}/>
            </ListItem>
          ))
        }
      </List>

      <Fab className={classes.fab} color="primary" aria-label="add" onClick={() => {
      }}>
        <AddIcon/>
      </Fab>
    </main>
  )
}

// Export the page
export default Page;