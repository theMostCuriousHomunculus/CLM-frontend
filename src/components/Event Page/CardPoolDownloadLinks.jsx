import React from 'react';
import MUITypography from '@mui/material/Typography';
import { CSVLink } from 'react-csv';

import generateCSVList from '../../functions/generate-csv-list';

export default function CardPoolDownloadLinks ({ me, others }) {

  return (
    <div style={{ margin: 4 }}>
      <MUITypography variant="body1">
        <CSVLink
          data={generateCSVList(
            me.mainboard,
            me.sideboard
          )}
          filename={`${me.account.name}.csv`}
          target="_blank"
        >
          Download your card pool in CSV format for MTGO play!
        </CSVLink>
      </MUITypography>
      {others.map(function (plr) {
        const cardpool = [];

        if (plr.mainboard) {
          for (const card of plr.mainboard) {
            cardpool.push(card);
          }
        }

        if (plr.sideboard) {
          for (const card of plr.sideboard) {
            cardpool.push(card);
          }
        }

        if (cardpool.length > 0) {
          return (
            <MUITypography key={plr.account._id} variant="body1">
              <CSVLink
                data={cardpool.reduce(function (a, c) {
                  return a + " ,1," + c.mtgo_id + ", , , , ,No,0\n";
                }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium,Sideboarded,Annotation\n")}
                filename={`${plr.account.name}.csv`}
                target="_blank"
              >
                Download {plr.account.name}'s card pool in CSV format for MTGO play!
              </CSVLink>
            </MUITypography>
          );
        } else {
          return null
        }
      })}
    </div>
  );
};