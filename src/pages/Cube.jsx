import React from 'react';
import { useParams } from 'react-router-dom';
import MUIPaper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
import CurveView from '../components/Cube Page/CurveView';
import HoverPreview from '../components/Cube Page/HoverPreview';
import ListView from '../components/Cube Page/ListView';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import TableView from '../components/Cube Page/TableView';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useCube } from '../hooks/cube-hook';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  hoverPreviewArea: {
    marginBottom: 190,
    marginTop: -8
  },
  paper: {
    margin: '0 8px 8px 8px'
  }
});

const Cube = () => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [cubeState, dispatch] = useCube(true);
  const [loading, setLoading] = React.useState(true);
  const { sendRequest } = useRequest();

  const [preview, setPreview] = React.useState({
    back_image: null,
    container_display: "none",
    image: null,
    image_display: "none",
    left: 0,
    right: undefined,
    top: 0
  });

  React.useEffect(() => {
    const fetchCube = async function () {
      try {
        const cubeData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`, 'GET', null, {});
        dispatch('UPDATE_CUBE', cubeData);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchCube();
  }, [cubeId, dispatch, sendRequest]);

  async function addCard (chosenCard) {
    delete chosenCard.art_crop;
    try {
      const cardData = JSON.stringify({
        ...chosenCard,
        action: 'add_card',
        component: cubeState.active_component_id
      });

      const updatedCube = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        cardData,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      dispatch('UPDATE_CUBE', updatedCube);

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

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

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>

          <CubeInfo creator={cubeState.cube.creator} />

          <ComponentInfo />

          {authentication.userId === cubeState.cube.creator._id &&
            <MUIPaper className={classes.paper}>
              <ScryfallRequest
                buttonText="Add it!"
                labelText={`Add a card to ${cubeState.active_component_name}`}
                onSubmit={addCard}
              />
            </MUIPaper>
          }

          <div className={classes.hoverPreviewArea} onMouseMove={movePreview}>
            <HoverPreview {...preview} />
            {cubeState.view_mode === 'Curve' &&
              <CurveView
                hidePreview={hidePreview}
                showPreview={showPreview}
              />
            }
            {cubeState.view_mode === 'List' &&
              <ListView
                hidePreview={hidePreview}
                showPreview={showPreview}
              />
            }
            {cubeState.view_mode === 'Table' &&
              <TableView
                hidePreview={hidePreview}
                showPreview={showPreview}
              />
            }
          </div>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default Cube;