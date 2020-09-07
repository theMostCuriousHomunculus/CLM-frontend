import React from 'react';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  loading: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  }
})

const LoadingSpinner = () => {

  const classes = useStyles();

  return (
    <div className={classes.loading}>
      <MUICircularProgress />
    </div>
  );
}

export default LoadingSpinner;