// Copyright (c) 2020 Wouter van der Wal

import { Location } from '../@types/interfaces'
import useFetch from 'use-http'
import { serverUrl, authHeader } from '../global'

export default () => {
  const { data = [] }: { data:Location[]|undefined } = useFetch(
    `${serverUrl}/location`,
    {
      headers: {
        ...authHeader
      }
    },
    []
  )

  return data
}
