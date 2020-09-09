// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import { Container, Typography, List, TextField, ListItem, ListItemText, Fab, Zoom } from '@material-ui/core'
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
import ListSkeleton from '../../components/ListSkeleton'
import language from '../../language'
import useUser from '../../hooks/useUsers'

const l = language.exportPage
const lg = language.global

export default function ExportPage () {
  const classes = useStyles()
  const { users } = useUser()

  // Get the info
  const [search, setSearch] = useState('')
  const [list, setList] = useState([] as User[])

  // Update when search changes
  useEffect(() => {
    const s = search.toLowerCase()

    setList(users.filter(user => {
      // Search array
      return (
        user.firstname.toLowerCase().indexOf(s) !== -1 ||
        user.lastname.toLowerCase().indexOf(s) !== -1 ||
        user.username.toLowerCase().indexOf(s) !== -1
      )
    }))
  }, [search, users])

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
      <Typography variant='h5'>{l.title}</Typography>

      <List className='list'>
        <TextField
          label={lg.search}
          fullWidth
          className={classes.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {(list.length === 0) ? <ListSkeleton times={3} /> : null}
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={56}
              itemCount={list.length}
            >
              {({ index, style }) => (
                <ListItem
                  key={list[index].userId}
                  style={style}
                  button
                  onClick={() => {
                    // Download that user
                    setDownloadId(list[index].userId)
                    setUserInfo({
                      firstname: list[index].firstname,
                      lastname: list[index].lastname
                    })
                    setOpen(true)
                  }}
                >
                  <ListItemText
                    primary={`${list[index].firstname} ${list[index].lastname}`}
                    secondary={list[index].username}
                  />
                </ListItem>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </List>

      <Zoom in>
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
      </Zoom>

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
        worktype: string
      }[] = []
      e.forEach((i: Work) => {
        result.push({
          date: i.date,
          time: String(i.time),
          description: i.description,
          location: `${i.location.place} - ${i.location.name}`,
          worktype: i.worktype.name
        })
      })

      // Create a pdf
      const doc = new JSPDF({
        orientation: 'p'
      })

      doc.setFontSize(20)
      doc.text(lg.appName, 10, 15)

      doc.setFontSize(12)
      doc.text([
        `${l.exportDate}: ${moment().format('LLLL')}`,
        `${l.exportUser}: ${e[0]?.user.firstname || userInfo.firstname} ${e[0]?.user.lastname || userInfo.lastname}`,
        `${l.exportWeek}: ${moment(startDate).week()}`
      ], 10, 22)

      doc.line(10, 35, 201, 35)

      doc.table(10, 40, result, [
        {
          id: 'date',
          name: 'date',
          prompt: l.date,
          width: 32,
          padding: 0
        },
        {
          id: 'location',
          name: 'location',
          prompt: l.location,
          width: 81,
          padding: 0
        },
        {
          id: 'description',
          name: 'description',
          prompt: l.comment,
          width: 81,
          padding: 0
        },
        {
          id: 'worktype',
          name: 'worktype',
          prompt: l.worktype,
          width: 40,
          padding: 0
        },
        {
          id: 'time',
          name: 'time',
          prompt: l.duration,
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
