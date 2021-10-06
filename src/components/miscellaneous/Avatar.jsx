import React from 'react';
import MUIAvatar from '@mui/material/Avatar';
import MUITooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';

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