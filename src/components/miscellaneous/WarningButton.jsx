import React from 'react';
import MUIButton from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';

const useStyles = makeStyles({
  warningButton: {
    backgroundColor: theme.palette.warning.main,
    color: '#111111',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  }
});

export default function WarningButton ({
  children,
  fullWidth,
  onClick,
  startIcon
}) {

  return (
    <MUIButton
      className={useStyles().warningButton}
      fullWidth={!!fullWidth}
      onClick={onClick}
      startIcon={startIcon}
    >
      {children}
    </MUIButton>
  );
};