import React, { useState } from 'react';
import { List, ListSubheader, ListItem, ListItemText, TextField, makeStyles, Fab } from '@material-ui/core';
import { useFetch } from '../../scripts/ajax';
import { serverUrl, auth } from '../../global';
import _ from 'lodash';
import EditDialog from './editDialog';
import AddDialog from './addDialog';
import { Add as AddIcon } from '@material-ui/icons';

// Interfaces
export interface Location {
  location_id: number;
  name:        string;
  place:       string;
  id:          string;
}

// Custom styles
const useStyles = makeStyles((theme) => ({
  search: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "calc(100% - 32px)",
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}))

// Create the page
function Page() {
  const classes = useStyles();

  // Get the data from the server
  const [ updateId, setUpdateId ] = useState(new Date().toISOString()); // Used for force updating to location state
  const [ stateLocation ] = useFetch({
    url: `${serverUrl}/location`,
    method: 'get',
    ...auth,
    data: updateId
  });
  let locations:Array<Location> = _.get(stateLocation, "result", []);
  
  // Add the search option
  const [ searchValue, setSearchValue ] = useState("");
  locations = locations.filter((i) => {
    return (i.place.toLowerCase().includes(searchValue.toLowerCase()) || i.name.toLowerCase().includes(searchValue.toLowerCase()));
  });

  // Add the edit option
  const [ editId, setEditId ] = useState(0);
  const [ editDialog, setEditDialog ] = useState(false)
  const handleEdit = (location_id:number) => {
    return () => {
      setEditId(location_id);
      setEditDialog(true);
    }
  }

  // Add the option to add a location
  const [ addDialog, setAddDialog ] = useState(false);
  const handleAdd = () => {
    setAddDialog(true);
  }

  return (
    <main>
      <List subheader={<ListSubheader>Locations</ListSubheader>}>
        <TextField label="Search" fullWidth className={classes.search} value={searchValue} onChange={e => {setSearchValue(e.target.value)}}/>
        {
          locations.map((i) => (
            <ListItem button key={i.location_id} onClick={handleEdit(i.location_id)}>
              <ListItemText primary={`${i.place} - ${i.name}`} secondary={i.id}/>
            </ListItem>
          ))
        }
      </List>
      
      <Fab className={classes.fab} color="primary" onClick={handleAdd}>
        <AddIcon/>
      </Fab>

      <EditDialog open={editDialog} onClose={setEditDialog} location={
        _.get(locations, `[${_.findIndex(locations, ['location_id', editId])}]`, {
          place: 'No place',
          name: 'No name',
          id: 'No id',
          location_id: 0,
        })
      } update={setUpdateId}/>

      <AddDialog open={addDialog} onClose={setAddDialog} update={setUpdateId}/>
    </main>
  )
}

// Export the page
export default Page;