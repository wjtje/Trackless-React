// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import {
  Drawer as MaterialDrawer, List, ListItem, ListItemText, Divider, Typography, ListItemIcon
} from '@material-ui/core'
import useStyles from './useStyles'
import { Link } from 'react-router-dom'
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  AccountBox as AccountBoxIcon,
  DateRange as DateRangeIcon,
  LocationOn as LocationOnIcon,
  People as PeopleIcon
} from '@material-ui/icons'

export default function Drawer (props: {
  open: boolean;
  onClose: () => void;
}) {
  const classes = useStyles()

  return (
    <MaterialDrawer anchor='left' open={props.open} onClose={props.onClose}>
      <Typography variant='h6' className={classes.title}>Trackless</Typography>
      <Typography variant='body2' className={classes.subtitle}>Client beta</Typography>
      <Divider />
      <List className={classes.list}>

        <Link to='/' className={classes.link} onClick={props.onClose}>
          <ListItem button>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary='Home' />
          </ListItem>
        </Link>

        <Link to='/thisWeek' className={classes.link} onClick={props.onClose}>
          <ListItem button>
            <ListItemIcon><DateRangeIcon /></ListItemIcon>
            <ListItemText primary='This week' />
          </ListItem>
        </Link>

        <Link to='/account' className={classes.link} onClick={props.onClose}>
          <ListItem button>
            <ListItemIcon><AccountBoxIcon /></ListItemIcon>
            <ListItemText primary='Account' />
          </ListItem>
        </Link>

        <Link to='/location' className={classes.link} onClick={props.onClose}>
          <ListItem button>
            <ListItemIcon><LocationOnIcon /></ListItemIcon>
            <ListItemText primary='Location' />
          </ListItem>
        </Link>

        <Link to='/user' className={classes.link} onClick={props.onClose}>
          <ListItem button>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary='Users' />
          </ListItem>
        </Link>

        <Link to='/settings' className={classes.link} onClick={props.onClose}>
          <ListItem button>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary='Settings' />
          </ListItem>
        </Link>

      </List>
    </MaterialDrawer>
  )
}
