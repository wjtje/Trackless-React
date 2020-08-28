// Copyright (c) 2020 Wouter van der Wal

import React, { useState } from 'react'
import {
  AppBar as MaterialAppBar,
  Toolbar,
  IconButton,
  Typography
} from '@material-ui/core'
import {
  Menu as MenuIcon
} from '@material-ui/icons'
import useStyles from './useStyles'
import Drawer from '../drawer'

export default function AppBar () {
  const classes = useStyles()

  // Make the drawer work
  const [drawerState, setDrawerState] = useState(false)
  const onDrawerClose = () => {
    setDrawerState(false)
  }

  const onMenuButtonClick = () => {
    setDrawerState(true)
  }

  return (
    <MaterialAppBar position='static'>
      <Toolbar>
        <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' onClick={onMenuButtonClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' className={classes.title}>
          Trackless
        </Typography>
      </Toolbar>
      <Drawer open={drawerState} onClose={onDrawerClose} />
    </MaterialAppBar>
  )
}
