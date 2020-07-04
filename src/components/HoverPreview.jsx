import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  hoverPreviewContainer: {
    display: 'inline-block',
    position: 'absolute'
  },
  hoverPreviewImage: {
    height: 300,
    zIndex: 1
  }
});

const HoverPreview = (props) => {

  const classes = useStyles();

  return (
    <div
      className={classes.hoverPreviewContainer}
      id="hover-preview-container"
      style={{display: props.container_display, left: props.left, right: props.right, top: props.top}}
    >
      <img
        alt="front of card"
        className={classes.hoverPreviewImage}
        src={props.image}
        style={{display: props.image_display}}
      />
      {props.back_image &&
        <img
          alt="back of card"
          className={classes.hoverPreviewImage}
          src={props.back_image}
          style={{display: props.image_display}}
        />
      }
    </div>
  );
}

export default HoverPreview;