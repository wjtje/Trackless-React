// Copyright (c) 2020 Wouter van der Wal

import { makeStyles } from '@material-ui/core'

export default makeStyles((theme) => ({
  table: {
    width: '100%'
  },
  thead: {
    fontWeight: 'bold'
  },
  td: {
    padding: '0',
    paddingRight: theme.spacing(2),
    minWidth: 38
  },
  tdFirst: {
    padding: 0,
    paddingRight: theme.spacing(2),
    width: 125,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  tr: {
    cursor: 'pointer'
  },
  bold: {
    fontWeight: 'bold'
  },
  spacing: {
    marginBottom: theme.spacing(2),
    display: 'inline-block'
  }
}))
