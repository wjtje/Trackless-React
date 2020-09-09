// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
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
  People as PeopleIcon,
  ImportExport as ImportExportIcon,
  History as HistoryIcon
} from '@material-ui/icons'
import { serverUrl, authHeader } from '../../global'
import { Access } from '../../@types/interfaces'
import $ from 'jquery'
import language from '../../language'

const l = language.drawer
const lg = language.global

export default function Drawer (props: {
  open: boolean;
  onClose: () => void;
}) {
  const classes = useStyles()

  const [access, setAccess] = useState([] as string[])
  useEffect(() => {
    $.ajax({
      url: `${serverUrl}/access/group/~`,
      headers: {
        ...authHeader
      }
    }).done((e: Access[]) => {
      const result: string[] = []

      e.forEach(f => {
        result.push(f.access)
      })

      setAccess(result)

      // Move to correct page
      if (
        (
          result.indexOf('trackless.location.read') === -1 ||
          result.indexOf('trackless.work.readOwn') === -1 ||
          result.indexOf('trackless.work.removeOwn') === -1 ||
          result.indexOf('trackless.work.editOwn') === -1
        ) &&
        window.location.href.split('/')[window.location.href.split('/').length - 1] === ''
      ) {
        window.location.href = '/export'
      }
    })
  }, [])

  return (
    <MaterialDrawer anchor='left' open={props.open} onClose={props.onClose}>
      <Typography variant='h6' className={classes.title}>{lg.appName}</Typography>
      <Typography variant='body2' className={classes.subtitle}>{l.subTitle}</Typography>
      <Divider />
      <List className={classes.list}>

        <Link
          to='/'
          className={classes.link}
          onClick={props.onClose}
          hidden={(
            access.indexOf('trackless.location.read') === -1 ||
            access.indexOf('trackless.work.readOwn') === -1 ||
            access.indexOf('trackless.work.removeOwn') === -1 ||
            access.indexOf('trackless.work.editOwn') === -1 ||
            access.indexOf('trackless.worktype.read') === -1
          )}
        >
          <ListItem button>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={l.home} />
          </ListItem>
        </Link>

        <Link
          to='/thisWeek'
          className={classes.link}
          onClick={props.onClose}
          hidden={(
            access.indexOf('trackless.location.read') === -1 ||
            access.indexOf('trackless.work.readOwn') === -1 ||
            access.indexOf('trackless.work.removeOwn') === -1 ||
            access.indexOf('trackless.work.editOwn') === -1 ||
            access.indexOf('trackless.worktype.read') === -1
          )}
        >
          <ListItem button>
            <ListItemIcon><DateRangeIcon /></ListItemIcon>
            <ListItemText primary={l.thisWeek} />
          </ListItem>
        </Link>

        <Link
          to='/history'
          className={classes.link}
          onClick={props.onClose}
          hidden={(
            access.indexOf('trackless.location.read') === -1 ||
            access.indexOf('trackless.work.readOwn') === -1 ||
            access.indexOf('trackless.work.removeOwn') === -1 ||
            access.indexOf('trackless.work.editOwn') === -1 ||
            access.indexOf('trackless.worktype.read') === -1
          )}
        >
          <ListItem button>
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText primary={l.history} />
          </ListItem>
        </Link>

        <Link
          to='/export'
          className={classes.link}
          onClick={props.onClose}
          hidden={(
            access.indexOf('trackless.work.readAll') === -1 ||
            access.indexOf('trackless.user.readAll') === -1
          )}
        >
          <ListItem button>
            <ListItemIcon><ImportExportIcon /></ListItemIcon>
            <ListItemText primary={l.export} />
          </ListItem>
        </Link>

        <Link
          to='/account'
          className={classes.link}
          onClick={props.onClose}
          hidden={(
            access.indexOf('trackless.user.readOwn') === -1 ||
            access.indexOf('trackless.user.editOwn') === -1 ||
            access.indexOf('trackless.api.read') === -1 ||
            access.indexOf('trackless.api.remove') === -1
          )}
        >
          <ListItem button>
            <ListItemIcon><AccountBoxIcon /></ListItemIcon>
            <ListItemText primary={l.account} />
          </ListItem>
        </Link>

        <Link
          to='/location'
          className={classes.link}
          onClick={props.onClose}
          hidden={(
            access.indexOf('trackless.location.read') === -1 ||
            access.indexOf('trackless.location.remove') === -1 ||
            access.indexOf('trackless.location.edit') === -1 ||
            access.indexOf('trackless.location.create') === -1
          )}
        >
          <ListItem button>
            <ListItemIcon><LocationOnIcon /></ListItemIcon>
            <ListItemText primary={l.location} />
          </ListItem>
        </Link>

        <Link
          to='/user'
          className={classes.link}
          onClick={props.onClose}
          hidden={(
            access.indexOf('trackless.user.readAll') === -1 ||
            access.indexOf('trackless.user.create') === -1 ||
            access.indexOf('trackless.user.remove') === -1 ||
            access.indexOf('trackless.user.editAll') === -1 ||
            access.indexOf('trackless.group.add') === -1
          )}
        >
          <ListItem button>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary={l.users} />
          </ListItem>
        </Link>

        <Link
          to='/settings'
          className={classes.link}
          onClick={props.onClose}
        >
          <ListItem button>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary={l.settings} />
          </ListItem>
        </Link>

      </List>
    </MaterialDrawer>
  )
}
