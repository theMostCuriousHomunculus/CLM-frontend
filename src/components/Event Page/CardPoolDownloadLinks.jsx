import React from 'react';
import MUITypography from '@material-ui/core/Typography';
import { CSVLink } from 'react-csv';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  downloadLink: {
    marginLeft: 8
  }
});

const CardPoolDownloadLinks = (props) => {

  const { me, others } = props;
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
        const cardpool = [...plr.mainboard, ...plr.sideboard, ...plr.chaff];

        return (
          <MUITypography variant="body1">
            <CSVLink
              className={classes.downloadLink}
              data={cardpool.reduce(function (a, c) {
                return a + " ,1," + c + ", , , , ,No,0\n";
              }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium,Sideboarded,Annotation\n")}
              filename={`${plr.account.name}.csv`}
              key={plr.account._id}
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

export default CardPoolDownloadLinks;