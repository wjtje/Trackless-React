import React, { useState, useEffect } from 'react';
import { Add as AddIcon } from '@material-ui/icons';
import { Typography, makeStyles, Fab } from '@material-ui/core';
import { auth, serverUrl } from '../../global';
import { useFetch } from '../../scripts/ajax';
import _ from 'lodash';
import AddDialog from '../home/addDialog';
import moment from 'moment';
import ListWork from '../../components/listWork';
import EditDialog from '../home/editDialog';

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
  place:       string | JSX.Element;
  name:        string | JSX.Element;
  id:          string;
  occurrence?:  number;
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
  const [ updateId, setUpdateId ] = useState(new Date().toISOString());

  // Get the data from the server for the edit work component
  const workData:Array<Work> = _.get(useFetch({
    url: `${serverUrl}/work/user/~/date/${moment().day(0).format('YYYY-MM-DD')}/${moment().day(7).format('YYYY-MM-DD')}`,
    method: 'get',
    ...auth,
    data: {
      update: updateId, // A quick way to force reload
    },
  })[0], 'result', []);

  // Get last used from the server
  const lastUsed:number = _.get(useFetch({
    url: `${serverUrl}/location/user/~/last`,
    method: 'get',
    ...auth,
    data: {
      update: updateId, // A quick way to force reload
    }
  })[0], 'location_id', 0);

  // State for updating the location id
  const [locationId, setLocationId] = useState(0);

  // Check for changes in lastUsed
  useEffect(() => {
    setLocationId(lastUsed);
  }, [lastUsed]);

  // Add the edit option
  const [ editId, setEditId ] = useState(0);
  const [ editDialog, setEditDialog ] = useState(false);
  const handleEdit = (work_id: number) => {
    setEditId(work_id);
    setEditDialog(true);
  }

  return (
    <main className={classes.root}>
      <Typography variant="h5">This week</Typography>

      <div className={classes.holder}>
        <ListWork
          start={moment().day(0).format('YYYY-MM-DD')}
          end={moment().day(7).format('YYYY-MM-DD')}
          updateId={updateId}
          editWork={handleEdit}
        />
      </div>

      <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => {
        setAddDialog(true);
      }}>
        <AddIcon />
      </Fab>

      <AddDialog open={addDialog} onClose={setAddDialog} update={setUpdateId} locationId={locationId}/>
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