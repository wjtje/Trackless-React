import React, { useState } from 'react';
import { Add as AddIcon } from '@material-ui/icons';
import { Typography, ListItemText, List, ListItem, makeStyles, Fab } from '@material-ui/core';
import { auth, serverUrl } from '../../global';
import { useFetch } from '../../scripts/ajax';
import _ from 'lodash';
import AddDialog from './addDialog';
import moment from 'moment';
import EditDialog from './editDialog';

// Interfaces
export interface Work {
  work_id:     number;
  user:        User;
  group:       Group;
  location:    Location;
  time:        number;
  date:        string;
  description: string;
}

export interface Group {
  group_id:  number;
  groupName: string;
}

export interface Location {
  location_id: number;
  place:       string;
  name:        string;
  id:          string;
}

export interface User {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
}

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

// Create the page
function Page() {
  const classes = useStyles();
  const [ addDialog, setAddDialog ] = useState(false);

  // Get the data from the server
  const [ updateId, setUpdateId ] = useState(new Date().toISOString());
  const workData:Array<Work> = _.get(useFetch({
    url: `${serverUrl}/work/user/~/date/${moment().format('YYYY-MM-DD')}/${moment().format('YYYY-MM-DD')}`,
    method: 'get',
    ...auth,
    update: updateId, // A quick way to force reload
  })[0], 'result', []);

  // Add the edit option
  const [ editId, setEditId ] = useState(0);
  const [ editDialog, setEditDialog ] = useState(false);
  const handleEdit = (work_id: number) => {
    return () => {
      setEditId(work_id);
      setEditDialog(true);
    }
  }

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
            {workData.map((i) => (
              <tr className={classes.tr} key={i.work_id} onClick={handleEdit(i.work_id)}>
                <Typography variant="body2" component="td" className={classes.tdFirst}>{i.location.place} - {i.location.name}</Typography>
                <Typography variant="body2" component="td" className={classes.td}>{String(i.time).replace('.',',')} uur</Typography>
                <Typography variant="body2" component="td" className={classes.td}>{i.description}</Typography>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => {
        setAddDialog(true);
      }}>
        <AddIcon />
      </Fab>

      <AddDialog open={addDialog} onClose={setAddDialog} update={setUpdateId}/>
      <EditDialog open={editDialog} onClose={setEditDialog} update={setUpdateId} work={
        _.get(workData, `[${_.findIndex(workData, ['work_id', editId])}]`, {
          work_id: 0,
          location: {
            location_id: 0,
          },
          time: 0,
          date: "01-01-2020",
          description: "No description"
        })
      }/>
    </main>
  )
}

// Export the page
export default Page;