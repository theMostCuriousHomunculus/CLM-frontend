import React, { useContext } from 'react';
import MUITypography from '@mui/material/Typography';
import { CSVLink } from 'react-csv';

import generateCSVList from '../../functions/generate-csv-list';
import { AuthenticationContext } from '../../contexts/Authentication';
import { EventContext } from '../../contexts/event-context';

export default function CardPoolDownloadLinks() {
  const { userID } = useContext(AuthenticationContext);
  const { eventState } = useContext(EventContext);

  return (
    <div style={{ margin: 4 }}>
      {eventState.players.map(function (plr) {
        if (plr.mainboard && plr.sideboard) {
          // only show download links for yourself, unless you are the host, then show for everyone
          return (
            <MUITypography key={plr.account._id} variant="body1">
              {'Download '}
              <CSVLink
                data={generateCSVList(plr.mainboard, plr.sideboard)}
                filename={`${plr.account.name}-${eventState._id}.csv`}
                target="_blank"
              >
                {plr.account._id === userID
                  ? 'YOUR'
                  : `${plr.account.name.toUpperCase()}'s`}
              </CSVLink>
              {' card pool in CSV format for MTGO play!'}
            </MUITypography>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
