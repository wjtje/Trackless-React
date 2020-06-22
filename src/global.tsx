import React from "react";
import { Typography } from "@material-ui/core";

export const serverUrl = 'http://localhost:55565';
export const apiKey = localStorage.getItem('apiKey');
export const auth = {
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
}
export const version = "0.1.1";
export const NewInThisVersion = () => {
  return (
    <ul>
      <Typography component="li">Version option in settings.</Typography>
      <Typography component="li">Able to list all the locations.</Typography>
      <Typography component="li">Able to edit a location.</Typography>
      <Typography component="li">Able to add a location.</Typography>
      <Typography component="li">Dialogs are now fullscreen.</Typography>
    </ul>
  )
};