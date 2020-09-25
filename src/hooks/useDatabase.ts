import { DBSchema, IDBPDatabase, openDB } from 'idb'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { createGlobalState } from 'react-hooks-global-state'
import { User, Work, Location, Worktype } from '../@types/interfaces'
import { authHeader, serverUrl } from '../global'

// Define the database
interface TracklessDB extends DBSchema {
  work: {
    value: Work;
    key: number;
  }
  me: {
    value: User;
    key: number
  }
  location: {
    value: Location;
    key: number;
  }
  worktype: {
    value: Worktype;
    key: number;
  }
}

// Function for creating the database
async function createDatabase () {
  const db = await openDB<TracklessDB>('trackless-db', 1, {
    upgrade (db) {
      // Create all the objectStores
      db.createObjectStore('work', {
        keyPath: 'workID'
      })

      db.createObjectStore('me', {
        keyPath: 'userID'
      })

      db.createObjectStore('location', {
        keyPath: 'locationID'
      })

      db.createObjectStore('worktype', {
        keyPath: 'worktypeID'
      })
    }
  })

  return db
}

// Define the global states
const { useGlobalState } = createGlobalState({
  db: {} as IDBPDatabase<TracklessDB>,
  dbLoaded: false,
  dbUpdate: new Date().toISOString()
})

function useDatabase () {
  // Create all the states
  const [work, setWork] = useState([] as Work[])
  const [me, setMe] = useState([] as User[])
  const [location, setLocation] = useState([] as Location[])
  const [worktype, setWorktype] = useState([] as Worktype[])

  const [db, setDB] = useGlobalState('db')
  const [dbLoaded, setDbLoaded] = useGlobalState('dbLoaded')
  const [dbUpdate, setDbUpdate] = useGlobalState('dbUpdate')

  // Create a indexedDB database
  useEffect(() => {
    createDatabase().then((db) => {
      setDB(db)
    })
  }, [setDB])

  // Fill the database with the correct info if we are online
  useEffect(() => {
    // Check if the db is active and not loaded
    if (db.name && !dbLoaded) {
      setDbLoaded(true)
      console.log('Database active')
      // Check if we are online
      if (navigator.onLine) {
        console.log('Filling database')
        // Only load this week of data
        fetch(`${serverUrl}/work/user/~/date/${moment().day(0).format('YYYY-MM-DD')}/${moment().day(6).format('YYYY-MM-DD')}`, {
          headers: {
            ...authHeader
          }
        })
          .then(response => response.json())
          .then((data: Work[]) => {
            // Check if data is valid
            if (typeof data.length === 'number') {
              db.clear('work')
              data.forEach(i => db.put('work', i))
              setDbUpdate(new Date().toISOString())
            } else {
              // TODO: Make a custom function for showing a message
            }
          })

        // Get the users infomation
        fetch(`${serverUrl}/user/~`, {
          headers: {
            ...authHeader
          }
        })
          .then(response => response.json())
          .then((data: User[]) => {
            // Check if data is valid
            if (typeof data.length === 'number') {
              db.clear('me')
              data.forEach(i => db.put('me', i))
              setDbUpdate(new Date().toISOString())
            } else {
              // TODO: Make a custom function for showing a message
            }
          })

        // Get the users infomation
        fetch(`${serverUrl}/location`, {
          headers: {
            ...authHeader
          }
        })
          .then(response => response.json())
          .then((data: Location[]) => {
            // Check if data is valid
            if (typeof data.length === 'number') {
              db.clear('location')
              data.forEach(i => db.put('location', i))
              setDbUpdate(new Date().toISOString())
            } else {
              // TODO: Make a custom function for showing a message
            }
          })

        // Get the users infomation
        fetch(`${serverUrl}/worktype`, {
          headers: {
            ...authHeader
          }
        })
          .then(response => response.json())
          .then((data: Worktype[]) => {
            // Check if data is valid
            if (typeof data.length === 'number') {
              db.clear('worktype')
              data.forEach(i => db.put('worktype', i))
              setDbUpdate(new Date().toISOString())
            } else {
              // TODO: Make a custom function for showing a message
            }
          })
      } else {
        console.log('Using cached data')
        // Get the data from the indexedDB
        const fetchData = async function () {
          setWork(await db.getAll('work'))
          setMe(await db.getAll('me'))
          setLocation(await db.getAll('location'))
          setWorktype(await db.getAll('worktype'))
        }

        fetchData()
      }
    }
  }, [db, dbLoaded, setDbLoaded, setDbUpdate])

  // Update the states when the hook is used or dbUpdated
  useEffect(() => {
    // Check if the db is loaded and valid
    if (db.name) {
      const fetchData = async function () {
        setWork(await db.getAll('work'))
        setMe(await db.getAll('me'))
        setLocation(await db.getAll('location'))
        setWorktype(await db.getAll('worktype'))
      }

      fetchData()
    }
  }, [db, dbLoaded, dbUpdate])

  // Function for adding work
  function addWork (w: Work) {
    db.put('work', w)
    setDbUpdate(new Date().toISOString())
  }

  // Function for removing work
  function removeWork (w: number) {
    if (w !== 0) {
      db.delete('work', w)
      setDbUpdate(new Date().toISOString())
    }
  }

  return {
    addWork: addWork,
    removeWork: removeWork,

    work: work,
    me: me,
    location: location,
    worktype: worktype,
    db: db
  }
}

export default useDatabase
