// Copyright (c) 2020 Wouter van der Wal

import { User } from '../@types/interfaces'
import { serverUrl, authHeader } from '../global'
import { createGlobalState } from 'react-hooks-global-state'
import { useEffect } from 'react'

const { useGlobalState } = createGlobalState({
  users: [] as User[],
  userFetch: false
})

const useUser = () => {
  // Define the states
  const [users, setUsers] = useGlobalState('users')
  const [userFetch, setUserFetch] = useGlobalState('userFetch')

  // Fetch all the data onMount
  useEffect(() => {
    if (!userFetch) { // Check if we are already fetching
      setUserFetch(true)

      // Get locations
      fetch(`${serverUrl}/user`, {
        headers: {
          ...authHeader
        }
      })
        .then(response => response.json())
        .then(data => {
          if (typeof data.forEach === 'function') {
            setUsers(data)
          }
          setUserFetch(false)
        })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Get the new users form the serger
  function reloadUsers () {
    fetch(`${serverUrl}/user`, {
      headers: {
        ...authHeader
      }
    })
      .then(response => response.json())
      .then(data => {
        if (typeof data.forEach === 'function') {
          setUsers(data)
        }
      })
  }

  // Return the data
  return {
    users: users,
    reloadUsers: reloadUsers
  }
}

export default useUser
