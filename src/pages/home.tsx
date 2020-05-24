import React, { useState } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import { Typography } from '@material-ui/core';
import { serverUrl } from '../global';
import Skeleton from '@material-ui/lab/Skeleton';
import $ from 'jquery';

const apiKey = localStorage.getItem('apiKey');

// Create promise
const userInfo = new Promise((resolve, reject) => {
  $.ajax({
    url: serverUrl + '/user/~',
    method: "GET",
    data: {
      apiKey: apiKey
    },
  }).done(resolve).fail((errorResult) => {
    console.log(JSON.parse(errorResult.responseText));
    reject(JSON.parse(errorResult.responseText));
  });
});

// Create the page
function Page() {
  // States
  const [welcomeUser, setWelcomeUser] = useState(undefined);

  // Get the user info
  userInfo.then((response: any) => {
    setWelcomeUser(`Welcome ${JSON.parse(response).result[0].firstname} ${JSON.parse(response).result[0].lastname}`);
  });

  return (
    <main>
      <Typography variant="h5">{welcomeUser ? welcomeUser : <Skeleton />}</Typography>
      <Typography variant="h6">Today</Typography>
    </main>
  )
}

// Export the page
export default {
  name: 'Home',
  icon: <HomeIcon/>,
  showInMenu: true,
  url: '#/home',
  page: <Page/>
}