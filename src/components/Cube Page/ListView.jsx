import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import MUITypography from '@material-ui/core/Typography';
import RVAutoSizer from 'react-virtualized-auto-sizer';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import theme from '../../theme';
import useRequest from '../../hooks/request-hook';
import AuthorizedCardRow from './AuthorizedCardRow';
import cumulativePercent from '../../functions/cumulative-percent';
import ReactWindowStickyHeaderList from '../miscellaneous/ReactWindowStickyHeaderList';
import UnauthorizedCardRow from './UnauthorizedCardRow';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { monoColors } from '../../constants/color-objects';

const useStyles = makeStyles({
  headerCell: {
    background: "inherit",
    padding: "0 8px",
    position: "absolute",
    top: "50%",
    transform: "translate(0%, -50%)"
  },
  headerRow: {
    background: theme.palette.primary.main,
    borderRadius: "4px 0 0 0",
    color: theme.palette.secondary.main,
    minWidth: 1200,
    position: "relative"
  },
  tableContainer: {
    height: "80vh",
    padding: 0
  },
  tableRow: {
    display: "flex",
    fontFamily: "Ubuntu, Roboto, Arial, sans-serif",
    minWidth: 1200,
    '&:hover': {
      backgroundColor: monoColors[5].hex
    }
  }
});

export default function ListView ({
  activeComponentID,
  creator,
  displayedCardsLength,
  // hidePreview,
  // showPreview
}) {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeID = useParams().cubeId;
  const columnWidths = creator._id === authentication.userId ?
    ["20%", "17.5%", "7.5%", "15%", "15%", "12.5%", "12.5%"] :
    ["22.5%", "20%", "10%", "17.5%", "15%", "15%"];
  const columnNames = creator._id === authentication.userId ?
    ["Card Name", "Color Identity", "CMC", "Card Type", "Move / Delete", "Printing", "Purchase"] :
    ["Card Name", "Color Identity", "CMC", "Card Type", "Printing", "Purchase"];
  const headerColumns = columnNames.map(function (column, index) {
    return (
      <div
        className={classes.headerCell}
        key={`header${index}`}
        style={{
          left: cumulativePercent(columnWidths, index),
          width: columnWidths[index]
        }}
      >
        <MUITypography
          variant="h5"
        >
          {column}
        </MUITypography>
      </div>
    );
  });
  const headerRowSize = 60;
  const { sendRequest } = useRequest();

  const editCard = React.useCallback(async function (changes) {
    await sendRequest({
      headers: { CubeID: cubeID },
      operation: 'editCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  componentID: "${activeComponentID}",
                  ${changes}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [cubeID, activeComponentID, sendRequest]);

  return (
    <MUIPaper className={classes.tableContainer}>
      <RVAutoSizer>
        {({ height, width }) =>(
          <ReactWindowStickyHeaderList
            headerRow={
              <div className={classes.headerRow} style={{ height: headerRowSize }}>
                {headerColumns}
              </div>
            }
            headerRowSize={headerRowSize}
            height={height}
            itemCount={displayedCardsLength}
            itemSize={80}
            width={width}
          >
            {({ index, style }) => (
              // having some performance issues here; i don't want all rows to get re-rendered when one card is edited.
              <div className={classes.tableRow} style={style}>
                {creator._id === authentication.userId ?
                  <AuthorizedCardRow
                    columnWidths={columnWidths}
                    // hidePreview={hidePreview}
                    index={index}
                    // showPreview={showPreview}
                    editCard={editCard}
                  />
                  :
                  <UnauthorizedCardRow
                    columnWidths={columnWidths}
                    // hidePreview={hidePreview}
                    index={index}
                    // showPreview={showPreview}
                  />
                }
              </div>
            )}
          </ReactWindowStickyHeaderList>
        )}
      </RVAutoSizer>
    </MUIPaper>
  );
};