// Copyright (c) 2020 Wouter van der Wal

import { Worktype } from '../@types/interfaces'
import { serverUrl, authHeader } from '../global'
import { createGlobalState } from 'react-hooks-global-state'
import { useEffect } from 'react'

const { useGlobalState } = createGlobalState({
  worktypes: [] as Worktype[],
  worktypeFetch: false
})

const useWorktypes = () => {
  // Define the states
  const [worktypes, setWorktypes] = useGlobalState('worktypes')
  const [worktypeFetch, setWorktypeFetch] = useGlobalState('worktypeFetch')

  // Fetch all the data onMount
  useEffect(() => {
    if (!worktypeFetch) { // Check if we are already fetching
      setWorktypeFetch(true)

      // Get locations
      fetch(`${serverUrl}/worktype`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          if (typeof data.forEach === 'function') {
            setWorktypes(data)
          }
          setWorktypeFetch(false)
        })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Return the data
  return {
    worktypes: worktypes
  }
}

export default useWorktypes
