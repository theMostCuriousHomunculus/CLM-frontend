import React from 'react';
import MUIAvatar from '@mui/material/Avatar';
import MUITooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  extraLarge: {
    height: 150,
    width: 150
  },
  large: {
    height: 100,
    width: 100
  },
  medium: {
    height: 75,
    width: 75
  },
  small: {
    height: 50,
    width: 50
  }
});

export default function LargeAvatar({ alt, size, ...rest }) {
  const classes = useStyles();

  return (
    <MUITooltip title={alt}>
      <MUIAvatar
        alt={alt}
        className={size && classes[size]}
        imgProps={{ draggable: false }}
        {...rest}
      />
    </MUITooltip>
  );
}
