import React from 'react'
import { ListItem, ListItemText } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

export default function ListSkeleton (props: {
  times: number
}) {
  function times (i: (key: number) => React.ReactNode): React.ReactNode[] {
    const r: React.ReactNode[] = []

    for (let t = 0; t < props.times; t++) {
      r.push(i(t))
    }

    return r
  }

  return (
    <div>
      {times((i) => (
        <ListItem key={i}>
          <ListItemText
            primary={<Skeleton variant='text' />}
            secondary={<Skeleton variant='text' />}
          />
        </ListItem>
      )
      )}
    </div>
  )
}
