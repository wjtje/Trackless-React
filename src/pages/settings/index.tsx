import React, { useState } from 'react';
import { ListSubheader, Container, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import PrivacyDialog from './Privacy';
import {
  RotateLeft as ResetIcon,
  Info as PrivacyIcon,
} from '@material-ui/icons';

// Create the page
function Page() {
  const [ dialogOpen, setDialogOpen ] = useState(false);

  function resetApp() {
    localStorage.setItem('apiKey', undefined);
    location.reload();
  }

  return (
    <Container>
      <List
        subheader={<ListSubheader>Settings</ListSubheader>}
      >
        <ListItem button onClick={resetApp}>
          <ListItemIcon><ResetIcon/></ListItemIcon>
          <ListItemText primary="Reset app"/>
        </ListItem>
        <ListItem button onClick={() => {setDialogOpen(true)}}>
          <ListItemIcon><PrivacyIcon/></ListItemIcon>
          <ListItemText primary="Privacy Policy"/>
        </ListItem>
      </List>

      <PrivacyDialog open={dialogOpen} onClose={setDialogOpen}/>
    </Container>
  )
}

// Export the page
export default Page;