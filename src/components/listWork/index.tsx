// Copyright (c) 2020 Wouter van der Wal

import React from 'react'
import { Typography } from '@material-ui/core'
import useStyles from './useStyles'
import { Skeleton } from '@material-ui/lab'
import clsx from 'clsx'
import language from '../../language'
import moment from 'moment'
import useWork from '../../hooks/useWork'
import { Work } from '../../@types/interfaces'

const l = language.listWork

export default function ListWork (props: {
  startDate: string;
  endDate: string;
  onEdit: (work: Work) => void;
}) {
  const classes = useStyles()

  // Get the data from the server
  const { parcedWork } = useWork(props.startDate, props.endDate)

  return (
    <table>
      {Object.keys(parcedWork).map((date) => (
        <tbody key={date} className={clsx(classes.spacing, classes.table)}>
          {/* Display the day */}
          <tr>
            <td colSpan={3}>
              <Typography variant='h6'>
                {moment(date).format('LL')}
              </Typography>
            </td>
          </tr>
          {/* Display the table header */}
          <tr className={classes.thead}>
            <td
              className={classes.tdFirst}
              style={{
                minWidth: 200
              }}
            >
              <Typography variant='subtitle1' className={classes.bold}>
                {l.location}
              </Typography>
            </td>
            <td
              className={classes.td}
              style={{
                minWidth: 60
              }}
            >
              <Typography variant='subtitle1' className={classes.bold}>
                {l.duration}
              </Typography>
            </td>
            <td
              className={classes.td}
              style={{
                minWidth: 250
              }}
            >
              <Typography variant='subtitle1' className={classes.bold}>
                {l.comment}
              </Typography>
            </td>
          </tr>
          {/* Display the work */}
          {parcedWork[date].map((i) => (
            <tr
              className={classes.tr}
              key={i.workID}
              onClick={() => {
                props.onEdit(i)
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
          display: (Object.keys(parcedWork).length === 0) ? 'initial' : 'none'
        }}
      >
        {/* Display the day */}
        <tr>
          <td colSpan={3}>
            <Typography variant='h6'>
              {moment(props.startDate).format('LL')}
            </Typography>
          </td>
        </tr>
        {/* Display the table header */}
        <tr className={classes.thead}>
          <td
            className={classes.tdFirst}
            style={{
              minWidth: 200
            }}
          >
            <Typography variant='subtitle1' className={classes.bold}>
              {l.location}
            </Typography>
          </td>
          <td
            className={classes.td}
            style={{
              minWidth: 60
            }}
          >
            <Typography variant='subtitle1' className={classes.bold}>
              {l.duration}
            </Typography>
          </td>
          <td
            className={classes.td}
            style={{
              minWidth: 250
            }}
          >
            <Typography variant='subtitle1' className={classes.bold}>
              {l.comment}
            </Typography>
          </td>
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
