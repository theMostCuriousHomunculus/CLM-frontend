import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUICardContent from '@material-ui/core/CardContent';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  cardContent: {
    // '& ::-webkit-scrollbar-track': {
      // background: '#FF0000'
    // }
  }
});

export default function MatchLog (props) {

  const { log } = props;
  const classes = useStyles();

  return (
    <MUICard style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '15%' }}>
      <MUICardHeader
        disableTypography={true}
        title={<MUITypography variant="h5">Match Log</MUITypography>}
      />
      <MUICardContent className={classes.cardContent} style={{ flexGrow: 1, overflowY: 'auto' }}>
        {log.map((update, index) => <MUITypography key={`log-update-${index + 1}`} variant="body1">{index + 1}) {update}</MUITypography>)}
      </MUICardContent>
    </MUICard>
  );
}