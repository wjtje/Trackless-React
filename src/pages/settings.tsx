import React from 'react';
import { ListSubheader, Container, List, ListItem, ListItemText } from '@material-ui/core';

// Create the page
function Page() {

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
          <ListItemText primary="Reset app"/>
        </ListItem>
      </List>
    </Container>
  )
}

// Export the page
export default Page;