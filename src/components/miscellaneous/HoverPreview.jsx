import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  hoverPreviewContainer: {
    display: 'inline-block',
    position: 'absolute',
    zIndex: 1301
  },
  hoverPreviewImage: {
    borderRadius: 8,
    height: 300
  }
});

const HoverPreview = (props) => {

  const classes = useStyles();

  const [preview, setPreview] = React.useState({
    back_image: null,
    container_display: "none",
    image: null,
    image_display: "none",
    left: 0,
    right: undefined,
    top: 0
  });
  
  const hidePreview = React.useCallback(function () {
    setPreview(function (currentPreviewState) {
      return ({
        ...currentPreviewState,
        back_image: null,
        container_display: "none",
        image: null,
        image_display: "none"
      });
    });
  }, []);

  const movePreview = React.useCallback(function (event) {
    event.persist();
    const hpcWidth = document.getElementById('hover-preview-container').offsetWidth;
    const windowWidth = window.screen.width;
    let left, right;
    if (event.pageX < windowWidth / 2) {
      left = event.pageX - (hpcWidth * event.pageX / windowWidth) + 'px';
      right = undefined;
    } else {
      left = undefined;
      right = windowWidth - event.pageX - hpcWidth + (hpcWidth * event.pageX / windowWidth) + 'px';
    }

    setPreview(function (currentPreviewState) {
      return ({
        ...currentPreviewState,
        left,
        right,
        top: event.pageY + 12 + "px"
      });
    });
  }, [])

  const showPreview = React.useCallback(function (event) {
    event.persist();
    setPreview(function (currentPreviewState) {
      return ({
        ...currentPreviewState,
        back_image: event.target.getAttribute('back_image'),
        container_display: "block",
        image: event.target.getAttribute('image'),
        image_display: "inline"
      });
    });
  }, []);

  const childrenWithShowHidePreview = React.Children.map(props.children, (child) => {
    return child ? React.cloneElement(child, { hidePreview, showPreview }) : null;
  });

  return (
    <div onMouseMove={movePreview} style={{ flexGrow: 1, marginBottom: props.marginBottom }}>

      <div
        className={classes.hoverPreviewContainer}
        id="hover-preview-container"
        style={{display: preview.container_display, left: preview.left, right: preview.right, top: preview.top}}
      >
        <img
          alt="front of card"
          className={classes.hoverPreviewImage}
          src={preview.image}
          style={{display: preview.image_display}}
        />
        {preview.back_image &&
          <img
            alt="back of card"
            className={classes.hoverPreviewImage}
            src={preview.back_image}
            style={{display: preview.image_display}}
          />
        }
      </div>

      {childrenWithShowHidePreview}

    </div>
  );
};

export default HoverPreview;