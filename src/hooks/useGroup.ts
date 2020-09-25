// Copyright (c) 2020 Wouter van der Wal

import { Group } from '../@types/interfaces'
import { serverUrl, authHeader } from '../global'
import { createGlobalState } from 'react-hooks-global-state'
import { useEffect } from 'react'

const { useGlobalState } = createGlobalState({
  groups: [] as Group[],
  groupFetch: false
})

const useGroup = () => {
  // Define the states
  const [groups, setGroups] = useGlobalState('groups')
  const [groupFetch, setGroupFetch] = useGlobalState('groupFetch')

  // Fetch all the data onMount
  useEffect(() => {
    if (!groupFetch) { // Check if we are already fetching
      setGroupFetch(true)

      // Get locations
      fetch(`${serverUrl}/group`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          if (typeof data.forEach === 'function') {
            setGroups(data)
          }
          setGroupFetch(false)
        })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Return the data
  return {
    groups: groups
  }
}

export default useGroup
