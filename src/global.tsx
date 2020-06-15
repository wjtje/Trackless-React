import React from "react";
import { Typography } from "@material-ui/core";

export const serverUrl = 'http://localhost:55565';
export const apiKey = localStorage.getItem('apiKey');
export const auth = {
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
}
export const version = "0.1.0";
export const NewInThisVersion = () => {
  return (
    <Typography>
      <ul>
        <li>Version option in settings.</li>
        <li>Able to list all the locations.</li>
        <li>Able to edit a location.</li>
      </ul>
    </Typography>
  )
};