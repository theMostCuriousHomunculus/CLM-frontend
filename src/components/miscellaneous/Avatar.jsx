import React from 'react';
import MUIAvatar from '@material-ui/core/Avatar';
import MUITooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  large: {
    height: 75,
    width: 75
  },
  small: {
    height: 50,
    width: 50
  }
});

export default function LargeAvatar (props) {

  const classes = useStyles();
  const { alt, size, ...rest } = props;

  return (
    <MUITooltip title={alt}>
      <MUIAvatar alt={alt} className={classes[size]} imgProps={{ draggable: false }} {...rest} />
    </MUITooltip>
  );
};