// Copyright (c) 2020 Wouter van der Wal

import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import { serverUrl, authHeader } from '../../global'
import { Work } from '../../@types/interfaces'
import { Typography } from '@material-ui/core'
import useStyles from './useStyles'
import { Skeleton } from '@material-ui/lab'
import clsx from 'clsx'

export default function ListWork (props: {
  startDate: string;
  endDate: string;
  update?: string;
  onEdit: (workId: number) => void;
}) {
  const classes = useStyles()

  // Get the data from the server
  const [parcedData, setParcedData] = useState({} as {
    [value: string]: Work[];
  })

  useEffect(() => {
    $.ajax({
      method: 'get',
      url: `${serverUrl}/work/user/~/date/${props.startDate}/${props.endDate}`,
      headers: {
        ...authHeader,
        updateId: props.update
      }
    }).done((data: Work[]) => {
      // Sort the data by date
      const tempBuffer: {
        [value: string]: Work[];
      } = {}

      data.forEach((i) => {
        if (tempBuffer[i.date] === undefined) {
          tempBuffer[i.date] = [i]
        } else {
          tempBuffer[i.date].push(i)
        }
      })

      setParcedData(tempBuffer)
    })
  }, [props.startDate, props.endDate, props.update])

  return (
    <table>
      {Object.keys(parcedData).map((date) => (
        <tbody key={date} className={clsx(classes.spacing, classes.table)}>
          {/* Display the day */}
          <tr>
            <td colSpan={3}>
              <Typography variant='h6'>
                {date}
              </Typography>
            </td>
          </tr>
          {/* Display the table header */}
          <tr className={classes.thead}>
            <td className={classes.tdFirst}><Typography variant='subtitle1' className={classes.bold}>Project</Typography></td>
            <td className={classes.td}><Typography variant='subtitle1' className={classes.bold}>Tijd</Typography></td>
            <td className={classes.td}><Typography variant='subtitle1' className={classes.bold}>Opmerkingen</Typography></td>
          </tr>
          {/* Display the work */}
          {parcedData[date].map((i) => (
            <tr
              className={classes.tr}
              key={i.workId}
              onClick={() => {
                props.onEdit(i.workId)
              }}
            >
              <Typography variant='body2' component='td' className={classes.tdFirst}>{i.location.place} - {i.location.name}</Typography>
              <Typography variant='body2' component='td' className={classes.td}>{String(i.time).replace('.', ',')} uur</Typography>
              <Typography variant='body2' component='td' className={classes.td}>{i.description}</Typography>
            </tr>
          ))}
        </tbody>
      ))}
      {/* Create a skeleton */}
      <tbody
        className={classes.spacing}
        style={{
          display: (Object.keys(parcedData).length === 0) ? 'initial' : 'none'
        }}
      >
        {/* Display the day */}
        <tr>
          <td colSpan={3}>
            <Typography variant='h6'>
              {props.startDate}
            </Typography>
          </td>
        </tr>
        {/* Display the table header */}
        <tr className={classes.thead}>
          <td className={classes.tdFirst}><Typography variant='subtitle1' className={classes.bold}>Project</Typography></td>
          <td className={classes.td}><Typography variant='subtitle1' className={classes.bold}>Tijd</Typography></td>
          <td className={classes.td}><Typography variant='subtitle1' className={classes.bold}>Opmerkingen</Typography></td>
        </tr>
        {/* Display a skeleton */}
        <tr
          className={classes.tr}
        >
          <Typography variant='body2' component='td' className={classes.tdFirst}><Skeleton /></Typography>
          <Typography variant='body2' component='td' className={classes.td}><Skeleton /></Typography>
          <Typography variant='body2' component='td' className={classes.td}><Skeleton /></Typography>
        </tr>
      </tbody>
    </table>
  )
}
