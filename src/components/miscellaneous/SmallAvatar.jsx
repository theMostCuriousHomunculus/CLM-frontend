import React from 'react';
import MUIAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  smallAvatar: {
    height: '50px',
    marginRight: '16px',
    width: '50px'
  }
});

const SmallAvatar = function (props) {

  const classes = useStyles();

  return (
    <MUIAvatar className={classes.smallAvatar} {...props} />
  );
};

export default SmallAvatar;