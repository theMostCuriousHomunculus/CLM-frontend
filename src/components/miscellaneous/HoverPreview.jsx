import React from 'react';
import { createPortal } from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  imageContainer: {
    position: 'absolute',
    zIndex: 1301
  },
  hoverPreviewImage: {
    borderRadius: 8,
    display: 'inline',
    height: 264
  }
});

export default function HoverPreview ({ children }) {

  const classes = useStyles();
  const imageContainer = React.useRef();
  const [preview, setPreview] = React.useState({
    back_image: null,
    bottom: undefined,
    image: null,
    image_display: "none",
    left: 0,
    right: undefined,
    top: 0,
    visible: false
  });
  
  const hidePreview = React.useCallback(function () {
    setPreview(prevState => ({
      ...prevState,
      back_image: null,
      image: null,
      visible: false
    }));
  }, []);

  const movePreview = React.useCallback(function (event) {
    event.persist();
    const hpcWidth = imageContainer.current.offsetWidth;
    const windowWidth = window.screen.width;
    let left, right;

    if (event.pageX < windowWidth / 2) {
      left = `${event.pageX - (hpcWidth * event.pageX / windowWidth)}px`;
      right = undefined;
    } else {
      left = undefined;
      right = `${windowWidth - event.pageX - hpcWidth + (hpcWidth * event.pageX / windowWidth)}px`;
    }

    // TODO: something similar for the vertical axis

    setPreview(prevState => ({
      ...prevState,
      left,
      right,
      top: `${event.pageY + 12}px`
    }));
  }, []);

  const showPreview = React.useCallback(function (event) {
    event.persist();
    setPreview(prevState => ({
      ...prevState,
      back_image: event.target.getAttribute('back_image'),
      image: event.target.getAttribute('image'),
      visible: true
    }));
  }, []);

  const childrenWithShowHidePreview = React.Children.map(children, (child) => {
    return child ? React.cloneElement(child,
      {
        onMouseMove: movePreview,
        onMouseOut: hidePreview,
        onMouseOver: showPreview
      }
    ) : null;
  });

  return (
    <React.Fragment>

      {preview.visible &&
        createPortal(
          <div
            className={classes.imageContainer}
            ref={imageContainer}
            style={{
              bottom: preview.bottom,
              left: preview.left,
              right: preview.right,
              top: preview.top
            }}
          >
            <img
              alt="front of card"
              className={classes.hoverPreviewImage}
              src={preview.image}
            />
            {preview.back_image &&
              <img
                alt="back of card"
                className={classes.hoverPreviewImage}
                src={preview.back_image}
              />
            }
          </div>
          , document.getElementById('hover-preview'))
      }

      {childrenWithShowHidePreview}

    </React.Fragment>
  );
};