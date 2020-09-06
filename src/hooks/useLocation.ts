// Copyright (c) 2020 Wouter van der Wal

import { Location } from '../@types/interfaces'
import { serverUrl, authHeader } from '../global'
import { createGlobalState } from 'react-hooks-global-state'
import { useEffect } from 'react'

const { useGlobalState } = createGlobalState({
  locations: [] as Location[],
  lastUsed: [] as Location[],
  mostUsed: [] as Location[],
  locationFetch: false
})

const useLocation = () => {
  // Define the states
  const [locations, setLocation] = useGlobalState('locations')
  const [lastUsed, setLastUsed] = useGlobalState('lastUsed')
  const [mostUsed, setMostUsed] = useGlobalState('mostUsed')
  const [locationFetch, setLocationFetch] = useGlobalState('locationFetch')

  // Fetch all the data onMount
  useEffect(() => {
    if (!locationFetch) { // Check if we are already fetching
      setLocationFetch(true)

      // Get locations
      fetch(`${serverUrl}/location`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          setLocation(data)
          setLocationFetch(false)
        })

      // Get last used
      fetch(`${serverUrl}/location/user/~/last`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          setLastUsed(data)
        })

      // Get most used
      fetch(`${serverUrl}/location/user/~/most`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          setMostUsed(data)
        })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Return the data
  return {
    locations: locations,
    lastUsed: lastUsed,
    mostUsed: mostUsed
  }
}

export default useLocation
