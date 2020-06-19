import React from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, ListItem, List, ListItemText, ListItemSecondaryAction, IconButton, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import {
  Delete as DeleteIcon
} from '@material-ui/icons';
import { useFetch } from '../../scripts/ajax';
import { serverUrl, apiKey } from "../../global";
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import { useSnackbar } from "notistack";
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();0

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
  const handleClose = () => {
    props.onClose(false);
  }

  // Function for removing an apiKey
  const handleRemove = (api_id: number) => {
    // Send command to the server
    $.ajax({
      url: `${serverUrl}/api/${api_id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }).done(() => {
      enqueueSnackbar("Your changes has been saved", {
        variant: "success"
      });
    }).fail((result) => {
      enqueueSnackbar(`Could not save the changes! (${JSON.parse(result.responseText).message})`, {
        variant: "warning"
      });
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
    <Dialog open={props.open} onClose={handleClose} fullScreen={fullScreen}>
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