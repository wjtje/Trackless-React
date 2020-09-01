// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Container, Typography, List, TextField, ListItem, ListItemText, Fab } from '@material-ui/core'
import useStyles from './useStyles'
import { serverUrl, authHeader } from '../../global'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { User, Work } from '../../@types/interfaces'
import $ from 'jquery'
import './style.scss'
import ExportDialog from '../../components/exportDialog'
import { jsPDF as JSPDF } from 'jspdf'
import { GetApp as DownloadIcon } from '@material-ui/icons'
import moment from 'moment'

export default function ExportPage () {
  const classes = useStyles()

  // Get the info
  const [update] = useState(new Date().toISOString())
  const [data, setData] = useState([] as User[])
  useEffect(() => {
    $.ajax({
      url: `${serverUrl}/user`,
      headers: {
        ...authHeader,
        update: update
      }
    }).done((e) => {
      setData(e)
    })
  }, [update])

  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([] as User[])

  // Update when search changes
  useEffect(() => {
    const s = search.toLowerCase()

    setUsers(data.filter(user => {
      // Search array
      return (
        user.firstname.toLowerCase().indexOf(s) !== -1 ||
        user.lastname.toLowerCase().indexOf(s) !== -1 ||
        user.username.toLowerCase().indexOf(s) !== -1
      )
    }))
  }, [search, data])

  // Functions and states for exporting
  const [open, setOpen] = useState(false)
  const [downloadId, setDownloadId] = useState(0)
  const [userInfo, setUserInfo] = useState({
    firstname: 'Jhon',
    lastname: 'Doe'
  })
  const onClose = () => {
    setOpen(false)
  }
  const onExport = (startDate: string, endDate: string) => {
    if (downloadId !== 0) {
      $.ajax({
        url: `${serverUrl}/work/user/${downloadId}/date/${startDate}/${endDate}`,
        headers: {
          ...authHeader
        }
      }).done(exportToPdf(startDate))
    } else {
      // Get all users
      $.ajax({
        url: `${serverUrl}/user`,
        headers: {
          ...authHeader
        }
      }).done((users: User[]) => {
        users.forEach((user) => {
          $.ajax({
            url: `${serverUrl}/work/user/${user.userId}/date/${startDate}/${endDate}`,
            headers: {
              ...authHeader
            }
          }).done(exportToPdf(startDate))
        })
      })
    }
  }

  return (
    <Container className={classes.main}>
      <Typography variant='h5'>Export to pdf</Typography>

      <List className='list'>
        <TextField
          label='search'
          fullWidth
          className={classes.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={56}
              itemCount={users.length}
            >
              {({ index, style }) => (
                <ListItem
                  key={users[index].userId}
                  style={style}
                  button
                  onClick={() => {
                    // Download that user
                    setDownloadId(users[index].userId)
                    setUserInfo({
                      firstname: users[index].firstname,
                      lastname: users[index].lastname
                    })
                    setOpen(true)
                  }}
                >
                  <ListItemText
                    primary={`${users[index].firstname} ${users[index].lastname}`}
                    secondary={users[index].username}
                  />
                </ListItem>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </List>

      <Fab
        color='primary'
        aria-label='add'
        className={classes.fab}
        onClick={() => {
          // Download all users
          setDownloadId(0)
          setUserInfo({
            firstname: 'Jhon',
            lastname: 'Doe'
          })
          setOpen(true)
        }}
      >
        <DownloadIcon />
      </Fab>

      <ExportDialog open={open} onClose={onClose} onExport={onExport} />
    </Container>
  )

  function exportToPdf (startDate: string): JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<any, JQuery.Ajax.SuccessTextStatus, JQuery.jqXHR<any>, never>> {
    return (e: Work[]) => {
      // Sort the data
      const result: {
        date: string
        time: string
        description: string
        location: string
      }[] = []
      e.forEach((i: Work) => {
        result.push({
          date: i.date,
          time: String(i.time),
          description: i.description,
          location: `${i.location.place} - ${i.location.name}`
        })
      })

      // Create a pdf
      const doc = new JSPDF({
        orientation: 'p'
      })

      doc.setFontSize(20)
      doc.text('Trackless', 10, 15)

      doc.setFontSize(12)
      doc.text([
        `Date of export: ${moment().format('YYYY-MM-DD')}`,
        `User: ${e[0]?.user.firstname || userInfo.firstname} ${e[0]?.user.lastname || userInfo.lastname}`,
        `Week number: ${moment(startDate).week()}`
      ], 10, 22)

      doc.line(10, 35, 201, 35)

      doc.table(10, 40, result, [
        {
          id: 'date',
          name: 'date',
          prompt: 'Date',
          width: 32,
          padding: 0
        },
        {
          id: 'location',
          name: 'location',
          prompt: 'Location',
          width: 101,
          padding: 0
        },
        {
          id: 'description',
          name: 'description',
          prompt: 'description',
          width: 101,
          padding: 0
        },
        {
          id: 'time',
          name: 'time',
          prompt: 'Time',
          width: 20,
          padding: 0
        }
      ] as any as string[], {
        fontSize: 10
      })

      // Only download it when the user is not empty
      if (userInfo.firstname !== 'Jhon' || e[0]?.user.firstname !== undefined) {
        doc.save(`${e[0]?.user.firstname || userInfo.firstname} ${e[0]?.user.lastname || userInfo.lastname} - ${moment(startDate).week()} (${moment().format('YYYY-MM-DD')}).pdf`)
      }
    }
  }
}
