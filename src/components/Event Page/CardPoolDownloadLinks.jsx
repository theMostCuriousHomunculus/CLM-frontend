import React from 'react';
import MUITypography from '@material-ui/core/Typography';
import { CSVLink } from 'react-csv';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  downloadLink: {
    marginLeft: 8
  }
});

export default function CardPoolDownloadLinks ({ me, others }) {

  const classes = useStyles();

  const usedCardsString = me.mainboard.reduce(function (a, c) {
    return c && c.mtgo_id ? `${a}"${c.name}",1,${c.mtgo_id}, , , , ,No,0\n` : a;
  }, "");

  const unUsedCardsString = me.chaff.concat(me.sideboard).reduce(function (a, c) {
    return c && c.mtgo_id ? `${a}"${c.name}",1,${c.mtgo_id}, , , , ,Yes,0\n` : a;
  }, "");

  return (
    <React.Fragment>
      <MUITypography variant="body1">
        <CSVLink
          className={classes.downloadLink}
          data={`Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium,Sideboarded,Annotation\n${usedCardsString}${unUsedCardsString}`}
          filename={`${me.account.name}.csv`}
          target="_blank"
        >
          Download your card pool in CSV format for MTGO play!
        </CSVLink>
      </MUITypography>
      {others.map(function (plr) {
        const cardpool = [];

        if (plr.mainboard) cardpool.push(...plr.mainboard);

        if (plr.sideboard) cardpool.push(...plr.sideboard);

        if (plr.chaff) cardpool.push(...plr.chaff);

        return (
          <MUITypography key={plr.account._id} variant="body1">
            <CSVLink
              className={classes.downloadLink}
              data={cardpool.reduce(function (a, c) {
                return a + " ,1," + c + ", , , , ,No,0\n";
              }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium,Sideboarded,Annotation\n")}
              filename={`${plr.account.name}.csv`}
              target="_blank"
            >
              Download {plr.account.name}'s card pool in CSV format for MTGO play!
            </CSVLink>
          </MUITypography>
        );
      })}
    </React.Fragment>
  );
};