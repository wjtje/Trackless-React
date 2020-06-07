import React from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, ListItem, List, ListItemText, ListItemSecondaryAction, IconButton, makeStyles } from "@material-ui/core";
import {
  Delete as DeleteIcon
} from '@material-ui/icons';
import { useFetch } from '../../scripts/ajax';
import { serverUrl, apiKey } from "../../global";
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';

// Custom interfaces
export interface APIDetails {
  api_id:     number;
  createDate: string;
  lastUsed:   string;
  deviceName: string;
}

// Define custom style
const useStyles = makeStyles((theme) => ({
  spacing: {
    marginRight: theme.spacing(2),
  }
}));

export default function ActiveDevices(props: {
  open: boolean;
  onClose: (state: boolean) => void;
}) {
  const classes = useStyles();

  // Get the api data
  const [data, setData] = useFetch({
    url: `${serverUrl}/api/`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })

  const apiDetails:Array<APIDetails> = _.get(data, 'result', []);

  // Close dialog
  function handleClose() {
    props.onClose(false);
  }

  // Function for removing an apiKey
  function handleRemove(api_id: number) {
    // Send command to the server
    $.ajax({
      url: `${serverUrl}/api/${api_id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    // Remove from the list
    const index = _.findIndex(apiDetails, ['api_id', api_id]);
    delete apiDetails[index];

    setData({
      ...data,
      result: apiDetails
    });
  }

  // Create dialog
  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Active devices</DialogTitle>
      <DialogContent>
        <List>
          {apiDetails.map((api:APIDetails) => (
            <ListItem key={api.api_id}>
              <ListItemText
                className={classes.spacing}
                primary={api.deviceName}
                secondary={
                  <React.Fragment>
                    {`Create date: ${moment(api.createDate).format("DD-MM-YYYY HH:mm")}`}
                    <br/>
                    {`Last used: ${moment(api.lastUsed).format("DD-MM-YYYY HH:mm")}`}
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => { handleRemove(api.api_id) }}>
                  <DeleteIcon/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}