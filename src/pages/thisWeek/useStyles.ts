// Copyright (c) 2020 Wouter van der Wal

import { makeStyles } from '@material-ui/core'

export default makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}))
