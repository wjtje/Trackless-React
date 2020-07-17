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
      <Typography component="li">Able to view, add, remove and edit work</Typography>
      <Typography component="li">Updated code to work with server 0.3-beta.1</Typography>
      <Typography component="li">Made it a web app</Typography>
      <Typography component="li">Added support for the last and most used locations</Typography>
    </ul>
  )
};