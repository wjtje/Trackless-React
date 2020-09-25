// Copyright (c) 2020 Wouter van der Wal

import { loadingLocation } from './interfaces'
import React from 'react'
import { Skeleton } from '@material-ui/lab'

export const loadingSuggestions: loadingLocation[] = [
  {
    locationID: -1,
    name: <Skeleton />,
    place: <Skeleton />,
    id: ''
  },
  {
    locationID: -2,
    name: <Skeleton />,
    place: <Skeleton />,
    id: ''
  }
]
