import React, { useState } from 'react';
import { List, ListSubheader, ListItem, ListItemText, TextField, makeStyles } from '@material-ui/core';
import { useFetch } from '../../scripts/ajax';
import { serverUrl, auth } from '../../global';
import _ from 'lodash';

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
  }
}))

// Create the page
function Page() {
  const classes = useStyles();

  const [ searchValue, setSearchValue ] = useState("");
  let locations:Array<Location> = _.get(useFetch({
    url: `${serverUrl}/location`,
    method: 'get',
    ...auth
  })[0], "result", []);

  // Filter array
  locations = locations.filter((i) => {
    return (i.place.toLowerCase().includes(searchValue.toLowerCase()) || i.name.toLowerCase().includes(searchValue.toLowerCase()));
  });

  return (
    <main>
      <List subheader={<ListSubheader>Locations</ListSubheader>}>
        <TextField label="Search" fullWidth className={classes.search} value={searchValue} onChange={e => {setSearchValue(e.target.value)}}/>
        {
          locations.map((i) => (
            <ListItem button key={i.location_id}>
              <ListItemText primary={`${i.place} - ${i.name}`} secondary={i.id}/>
            </ListItem>
          ))
        }
      </List>
    </main>
  )
}

// Export the page
export default Page;