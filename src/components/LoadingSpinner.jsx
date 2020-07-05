import React from 'react';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  loading: {
    alignItems: 'center',
    display: 'flex',
    height: 'calc(100vh - 300px - 10.1rem)',
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