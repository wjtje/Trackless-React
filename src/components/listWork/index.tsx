import React from 'react';
import _ from 'lodash';
import { useFetch } from '../../scripts/ajax';
import { serverUrl, auth } from '../../global';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import { useStyles } from './const';
import { Result } from './interfaces';

// Export component
export default function ListWork(props: {
  start: string;
  end: string;
  updateId: string;
  editWork: (work_id: number) => void;
}) {
  const classes = useStyles();

  // Get data from server
  const workData:Array<Result> = _.get(useFetch({
    url: `${serverUrl}/work/user/~/date/${props.start}/${props.end}`,
      method: 'get',
      ...auth,
      data: {
        update: props.updateId, // A quick way to force reload
      },
  })[0], 'result', []);

  // Parse the data when workData changes
  const parcedData = {};
  workData.map((i) => {
    (parcedData[i.date] == undefined)? parcedData[i.date] = [i] : parcedData[i.date].push(i);
  });

  // Render the object
  return (
    <table>
      {Object.keys(parcedData).map((date:string) => (
        <tbody key={date}>
          {/* Display the day */}
          <tr>
            <td colSpan={3}>
              <Typography variant="h6">
                {moment(date).format("YYYY-MM-DD")}
              </Typography>
            </td>
          </tr>
          {/* Display the table header */}
          <tr className={classes.thead}>
            <td className={classes.tdFirst}><Typography variant="subtitle1" style={{fontWeight: 'bold'}}>Project</Typography></td>
            <td className={classes.td}><Typography variant="subtitle1" style={{fontWeight: 'bold'}}>Tijd</Typography></td>
            <td className={classes.td}><Typography variant="subtitle1" style={{fontWeight: 'bold'}}>Opmerkingen</Typography></td>
          </tr>
          {/* Display the work */}
          {parcedData[date].map((i:Result) => (
            <tr
              className={classes.tr}
              key={i.work_id}
              onClick={() => {
                props.editWork(i.work_id)
              }}
            >
              <Typography variant="body2" component="td" className={classes.tdFirst}>{i.location.place} - {i.location.name}</Typography>
              <Typography variant="body2" component="td" className={classes.td}>{String(i.time).replace('.',',')} uur</Typography>
              <Typography variant="body2" component="td" className={classes.td}>{i.description}</Typography>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}