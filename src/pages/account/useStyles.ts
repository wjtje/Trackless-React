// Copyright (c) 2020 Wouter van der Wal

import { makeStyles } from '@material-ui/core'

export default makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  spacing: {
    marginTop: theme.spacing(2)
  },
  tdFirst: {
    paddingRight: theme.spacing(2)
  },
  tdLast: {
    maxWidth: '100%',
    width: 250
  }
}))
