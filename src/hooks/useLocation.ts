// Copyright (c) 2020 Wouter van der Wal

import { Location } from '../@types/interfaces'
import { serverUrl, authHeader } from '../global'
import { createGlobalState } from 'react-hooks-global-state'
import { useEffect } from 'react'

const { useGlobalState } = createGlobalState({
  lastUsed: [] as Location[],
  mostUsed: [] as Location[],
  locationFetch: false
})

const useLocation = () => {
  // Define the states
  const [lastUsed, setLastUsed] = useGlobalState('lastUsed')
  const [mostUsed, setMostUsed] = useGlobalState('mostUsed')
  const [locationFetch, setLocationFetch] = useGlobalState('locationFetch')

  // Fetch all the data onMount
  useEffect(() => {
    if (!locationFetch) { // Check if we are already fetching
      setLocationFetch(true)

      // Get user location infomation
      fetch(`${serverUrl}/user/~/location`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          if (typeof data === 'object') {
            setLastUsed(data.last)
            setMostUsed(data.most)
          } else {
            setLastUsed([])
            setMostUsed([])
          }
        })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Return the data
  return {
    lastUsed: lastUsed,
    mostUsed: mostUsed
  }
}

export default useLocation
