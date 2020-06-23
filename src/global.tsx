import React from "react";
import { Typography } from "@material-ui/core";

export const serverUrl = 'http://localhost:55565';
export const apiKey = localStorage.getItem('apiKey');
export const auth = {
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
}
export const version = "0.2-beta.1";
export const NewInThisVersion = () => {
  return (
    <ul>
      <Typography component="li">Able to view and add work</Typography>
    </ul>
  )
};