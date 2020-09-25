// Copyright (c) 2020 Wouter van der Wal

import { Work } from '../@types/interfaces'
import { useState, useEffect } from 'react'
import useDatabase from './useDatabase'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { serverUrl, authHeader } from '../global'

const moment = extendMoment(Moment as any)

interface ParcedWork {
  [value: string]: Work[];
}

const useWork = (startDate?: string, endDate?: string) => {
  // Define the states
  const [dateWork, setDateWork] = useState([] as Work[])
  const [parcedWork, setParcedWork] = useState({} as ParcedWork)

  // Get infomation from the database
  const { work } = useDatabase()

  // Get work between the start and endDate
  useEffect(() => {
    // Check if it is in the cache
    const r = moment().range(
      moment().day(0).hour(0).minute(0).second(-1),
      moment().day(6).hour(0).minute(0).second(1)
    )
    if (r.contains(moment(startDate)) && r.contains(moment(endDate))) {
      // Get it from the local cache
      const range = moment().range(moment(startDate), moment(endDate))
      const buffer = [] as Work[]

      work.forEach((i) => {
        // Test if the work is beween the dates
        if (range.contains(moment(i.date))) {
          buffer.push(i)
        }
      })

      setDateWork(buffer)
    } else {
      // Get it from the server
      fetch(`${serverUrl}/user/~/work/?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          if (typeof data.forEach === 'function') {
            setDateWork(data)
          }
        })
    }
  }, [startDate, endDate, work])

  // Parce the work
  useEffect(() => {
    // Sort the data by date
    const tempBuffer: {
      [value: string]: Work[];
    } = {}

    dateWork.forEach((i) => {
      if (tempBuffer[i.date] === undefined) {
        tempBuffer[i.date] = [i]
      } else {
        tempBuffer[i.date].push(i)
      }
    })

    setParcedWork(tempBuffer)
  }, [dateWork])

  return {
    parcedWork: parcedWork
  }
}

export default useWork
