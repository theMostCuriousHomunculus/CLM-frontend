import React from 'react';
import MUIAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  largeAvatar: {
    height: '75px',
    width: '75px'
  }
});

const LargeAvatar = function (props) {

  const classes = useStyles();

  return (
    <MUIAvatar className={classes.largeAvatar} {...props} />
  );
};

export default LargeAvatar;