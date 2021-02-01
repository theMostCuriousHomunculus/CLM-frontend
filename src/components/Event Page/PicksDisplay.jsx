import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import SortableList from './SortableList';

const useStyles = makeStyles({
  collectionContainer: {
    marginBottom: 0
  }
});

const PicksDisplay = function (props) {

  const classes = useStyles();
  const { eventState, moveCard, onSortEnd } = props;

  return (
    <React.Fragment>
      <MUICard className={classes.collectionContainer}>
        <MUICardHeader
          disableTypography={true}
          title={<MUITypography variant="h5">Mainboard</MUITypography>}
          subheader={<MUITypography variant="subtitle1">The Crème de la Crème</MUITypography>}
        />
        <SortableList
          axis="xy"
          cards={eventState.mainboard}
          clickFunction={() => null}
          fromCollection={"mainboard"}
          moveCard={moveCard}
          onSortEnd={onSortEnd}
          toCollection1="sideboard"
          toCollection2="chaff"
        >
        </SortableList>
      </MUICard>

      <MUICard className={classes.collectionContainer}>
        <MUICardHeader
          disableTypography={true}
          title={<MUITypography variant="h5">Sideboard</MUITypography>}
          subheader={<MUITypography variant="subtitle1">The Cal Naughton, Jrs of cube cards</MUITypography>}
        />
        <SortableList
          axis="xy"
          cards={eventState.sideboard}
          clickFunction={() => null}
          fromCollection={"sideboard"}
          moveCard={moveCard}
          onSortEnd={onSortEnd}
          toCollection1="mainboard"
          toCollection2="chaff"
        >
        </SortableList>
      </MUICard>

      <MUICard>
        <MUICardHeader
          disableTypography={true}
          title={<MUITypography variant="h5">Chaff</MUITypography>}
          subheader={<MUITypography variant="subtitle1">The crap you aren't gunna use</MUITypography>}
        />
        <SortableList
          axis="xy"
          cards={eventState.chaff}
          clickFunction={() => null}
          fromCollection={"chaff"}
          moveCard={moveCard}
          onSortEnd={onSortEnd}
          toCollection1="mainboard"
          toCollection2="sideboard"
        >
        </SortableList>
      </MUICard>
    </React.Fragment>
  );
};

export default PicksDisplay;