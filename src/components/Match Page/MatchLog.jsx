import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUICardContent from '@material-ui/core/CardContent';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    // 4px margin is being applied to both the wrapping container and the card for 8px each on top and bottom
    height: 'calc(100vh - 16px)',
    width: 200
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flexGrow: 1,
    overflowY: 'auto'
  }
});

export default function MatchLog ({ log }) {

  const classes = useStyles();

  return (
    <MUICard className={classes.card}>
      <MUICardHeader
        disableTypography={true}
        title={<MUITypography variant="h5">Match Log</MUITypography>}
      />
      <MUICardContent className={classes.cardContent}>
        {/*some tricky css here for a nice auto scroll effect*/} 
        {log.map((val, index, array) => array[array.length - 1 - index]).map((update, index, array) => {
          return (
            <MUITypography
              key={`log-update-${array.length - index}`}
              variant="body2"
            >
              {array.length - index}) {update}
            </MUITypography>
          );
        })}
      </MUICardContent>
    </MUICard>
  );
}