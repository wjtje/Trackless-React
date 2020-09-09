// Copyright (c) 2020 Wouter van der Wal

import { makeStyles } from '@material-ui/core'

export default makeStyles((theme) => ({
  spacing: {
    marginTop: theme.spacing(2)
  },
  wrapper: {
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}))
