import React from 'react';
import MUICard from '@mui/material/Card';
import MUICardHeader from '@mui/material/CardHeader';
import MUICardContent from '@mui/material/CardContent';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import { MatchContext } from '../../contexts/match-context';

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

export default function MatchLog() {
  const classes = useStyles();
  const {
    matchState: { log }
  } = React.useContext(MatchContext);

  return (
    <MUICard className={classes.card}>
      <MUICardHeader title="Match Log" />
      <MUICardContent className={classes.cardContent}>
        {log
          .map((val, index, array) => array[array.length - 1 - index])
          .map((update, index, array) => {
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
