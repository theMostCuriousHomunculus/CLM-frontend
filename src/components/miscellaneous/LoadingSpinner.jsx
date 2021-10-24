import React from 'react';
import MUICircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  loadingContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center'
  }
});

export default function LoadingSpinner() {
  const classes = useStyles();

  return (
    <div className={classes.loadingContainer}>
      <MUICircularProgress size={100} />
    </div>
  );
}
