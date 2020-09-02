// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Dialog, useMediaQuery, useTheme, DialogContent, DialogActions, DialogTitle, Button, ListItemText, List, ListItem } from '@material-ui/core'
import { Api } from '../../../@types/interfaces'
import { serverUrl, authHeader } from '../../../global'
import moment from 'moment'
import $ from 'jquery'
import { useSnackbar } from 'notistack'

export default function ActiveDevices (props: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { enqueueSnackbar } = useSnackbar()

  const [update, setUpdate] = useState(new Date().toISOString())
  const [data, setDate] = useState([] as Api[])

  useEffect(() => {
    $.ajax({
      url: `${serverUrl}/api`,
      headers: {
        ...authHeader,
        update: update
      }
    }).done((e) => {
      setDate(e)
    })
  }, [update])

  const [open, setOpen] = useState(false)
  const [id, setId] = useState(0)
  const [name, setName] = useState('')

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
        <DialogTitle>
          Active devices
        </DialogTitle>
        <DialogContent>
          <List>
            {data.map((i) => (
              <ListItem
                key={i.apiId}
                button
                onClick={() => {
                  setId(i.apiId)
                  setName(i.deviceName)
                  setOpen(true)
                }}
              >
                <ListItemText
                  primary={i.deviceName}
                  secondary={`last used: ${moment(i.lastUsed).format('YYYY-MM-DD HH:mm')}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={props.onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => {
          setId(0)
          setOpen(false)
        }}
      >
        <DialogTitle>
          Remove
        </DialogTitle>
        <DialogContent>
          Are you sure to remove access to &apos;{name}&apos;
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            onClick={() => {
              setId(0)
              setOpen(false)

              $.ajax({
                url: `${serverUrl}/api/${id}`,
                method: 'delete',
                headers: {
                  ...authHeader
                }
              }).done(() => {
                // Show a toast
                enqueueSnackbar('Saved!', {
                  variant: 'success',
                  autoHideDuration: 2000
                })

                setUpdate(new Date().toISOString())
              })
            }}
          >
            Yes
          </Button>
          <Button
            color='primary'
            onClick={() => {
              setId(0)
              setOpen(false)
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
