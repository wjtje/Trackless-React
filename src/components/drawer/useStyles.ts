// Copyright (c) 2020 Wouter van der Wal

import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  list: {
    width: 250
  },
  title: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  subtitle: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary
  }
}))
