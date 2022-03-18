import React from 'react';
import { createPortal } from 'react-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  imageContainer: {
    position: 'absolute',
    zIndex: 1301
  },
  hoverPreviewImage: {
    borderRadius: 8,
    display: 'inline',
    height: 350
  }
});

export default function HoverPreview({ back_image, children, image }) {
  const classes = useStyles();
  const imageContainer = React.useRef();
  const [preview, setPreview] = React.useState({
    bottom: undefined,
    image_display: 'none',
    left: 0,
    right: undefined,
    top: 0,
    visible: false
  });

  const hidePreview = React.useCallback(function () {
    setPreview((prevState) => ({
      ...prevState,
      visible: false
    }));
  }, []);

  const movePreview = React.useCallback(function (event) {
    event.persist();

    const hpcWidth = imageContainer.current.offsetWidth;
    const pageHeight = document.getElementsByTagName('body')[0].offsetHeight;
    const windowHeight = window.screen.height;
    const windowWidth = window.screen.width;
    let bottom, left, right, top;

    if (event.pageX < windowWidth / 2) {
      left = `${event.pageX - (hpcWidth * event.pageX) / windowWidth}px`;
      right = undefined;
    } else {
      left = undefined;
      right = `${windowWidth - event.pageX - hpcWidth + (hpcWidth * event.pageX) / windowWidth}px`;
    }

    if (event.screenY < windowHeight / 2) {
      bottom = undefined;
      top = `${event.pageY + 24}px`;
    } else {
      bottom = `${pageHeight - event.pageY + 12}px`;
      top = undefined;
    }

    setPreview((prevState) => ({
      ...prevState,
      bottom,
      left,
      right,
      top
    }));
  }, []);

  const showPreview = React.useCallback(function () {
    setPreview((prevState) => ({
      ...prevState,
      visible: true
    }));
  }, []);

  const childrenWithShowHidePreview = React.Children.map(children, (child) =>
    child
      ? React.cloneElement(child, {
          onMouseMove: movePreview,
          onMouseOut: hidePreview,
          onMouseOver: showPreview
        })
      : null
  );

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
            <img alt="front of card" className={classes.hoverPreviewImage} src={image} />
            {back_image && (
              <img alt="back of card" className={classes.hoverPreviewImage} src={back_image} />
            )}
          </div>,
          document.getElementById('hover-preview')
        )}

      {childrenWithShowHidePreview}
    </React.Fragment>
  );
}
