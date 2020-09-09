// Copyright (c) 2020 Wouter van der Wal

import { Work } from '../@types/interfaces'
import { useState, useEffect } from 'react'
import { serverUrl, authHeader } from '../global'
import { createGlobalState } from 'react-hooks-global-state'

const { useGlobalState } = createGlobalState({
  work: [] as Work[],
  workUpdate: new Date().toISOString(),
  workFetch: false
})

interface ParcedWork {
  [value: string]: Work[];
}

const useWork = (startDate?: string, endDate?: string) => {
  // Define the states
  const [work, setWork] = useGlobalState('work')
  const [workUpdate, setWorkUpdate] = useGlobalState('workUpdate')
  const [workFetch, setWorkFetch] = useGlobalState('workFetch')
  const [parcedWork, setParcedWork] = useState({} as ParcedWork)

  // Fetch all the data onMount
  useEffect(() => {
    if (startDate != null && endDate != null && !workFetch) {
      setWorkFetch(true)

      console.time('Getting work from server')

      fetch(`${serverUrl}/work/user/~/date/${startDate}/${endDate}`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          if (typeof data.forEach === 'function') {
            setWork(data)
          }
          setWorkFetch(false)
          console.timeEnd('Getting work from server')
        })
    }
  }, [startDate, endDate, setWork, workUpdate]) // eslint-disable-line react-hooks/exhaustive-deps

  // Parce the work
  useEffect(() => {
    console.time('Sorting work')

    // Sort the data by date
    const tempBuffer: {
      [value: string]: Work[];
    } = {}

    work.forEach((i) => {
      if (tempBuffer[i.date] === undefined) {
        tempBuffer[i.date] = [i]
      } else {
        tempBuffer[i.date].push(i)
      }
    })

    setParcedWork(tempBuffer)

    console.timeEnd('Sorting work')
  }, [work])

  // Custom functions for adding and updating work
  const update = () => {
    setWorkUpdate(new Date().toISOString())
  }

  // Export the data
  return {
    work: work,
    parcedWork: parcedWork,
    update: update
  }
}

export default useWork
