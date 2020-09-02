import React from 'react'
import { ListItem, ListItemText } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

export default function ListSkeleton (props: {
  times: number
}) {
  function times (i: React.ReactNode): React.ReactNode[] {
    const r: React.ReactNode[] = []

    for (let t = 0; t < props.times; t++) {
      r.push(i)
    }

    return r
  }

  return (
    <div>
      {times(
        <ListItem>
          <ListItemText
            primary={<Skeleton variant='text' />}
            secondary={<Skeleton variant='text' />}
          />
        </ListItem>
      )}
    </div>
  )
}
