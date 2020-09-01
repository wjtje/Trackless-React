// Copyright (c) 2020 Wouter van der Wal

import { makeStyles } from '@material-ui/core'

export default makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  search: {
    marginBottom: theme.spacing(2),
    width: `calc(100% - ${theme.spacing(4)})`
  }
}))
