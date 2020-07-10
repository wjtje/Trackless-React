import React, { useState } from 'react';
import { ListSubheader, Container, List, ListItem, ListItemText, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import PrivacyDialog from './Privacy';
import {
  RotateLeft as ResetIcon,
  Info as InfoIcon,
  Help as PrivacyIcon,
} from '@material-ui/icons';
import { version, NewInThisVersion, serverUrl } from '../../global';
import { useFetch } from '../../scripts/ajax';
import _ from 'lodash';

// Create the page
function Page() {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ versionOpen, setVersionOpen ] = useState(false);

  function resetApp() {
    localStorage.setItem('apiKey', undefined);
    location.reload();
  }

  const handleClose = () => { setVersionOpen(false); };

  // Get the server version
  const serverVersion = _.get(useFetch({
    url: `${serverUrl}/server/about`,
    method: 'get'
  })[0], 'version', 'Unknown');
  
  return (
    <Container>
      <List
        subheader={<ListSubheader>Settings</ListSubheader>}
      >
        <ListItem button onClick={() => {setVersionOpen(true)}}>
          <ListItemIcon><InfoIcon/></ListItemIcon>
          <ListItemText primary="Version" secondary={version}/>
        </ListItem>
        <ListItem>
          <ListItemIcon><InfoIcon/></ListItemIcon>
          <ListItemText primary="Server version" secondary={serverVersion}/>
        </ListItem>
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

      <Dialog open={versionOpen} onClose={handleClose}>
        <DialogTitle>New in this version</DialogTitle>
        <DialogContent>
          <NewInThisVersion/>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

// Export the page
export default Page;