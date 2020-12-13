import React from 'react';
import MUIAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  smallAvatar: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  }
});

export default function (props) {

  const { alt, src } = props;

  const classes = useStyles();

  return (
    <MUIAvatar alt={alt} className={classes.smallAvatar} src={src} />
  );
};