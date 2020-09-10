import React from 'react';
import { useParams } from 'react-router-dom';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
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
    marginBottom: 172,
    marginTop: -8
  }
});

const Cube = () => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [loading, setLoading] = React.useState(true);
  const [cubeState, dispatch] = useCube(true);
  const { sendRequest } = useRequest();

  const [creator, setCreator] = React.useState({
    _id: undefined
  });
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
        dispatch('UPDATE_CUBE', cubeData.cube);
        setCreator(cubeData.creator);
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

  function hidePreview () {
    setPreview({
      ...preview,
      back_image: null,
      container_display: "none",
      image: null,
      image_display: "none"
    });
  }

  function movePreview (event) {

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

    setPreview({
      ...preview,
      left,
      right,
      top: event.pageY + 12 + "px"
    });
  }

  function showPreview (event) {
    setPreview({
      ...preview,
      back_image: event.target.getAttribute('back_image'),
      container_display: "block",
      image: event.target.getAttribute('image'),
      image_display: "inline"
    });
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>

          {creator &&
            <CubeInfo creator={creator} />
          }

          <ComponentInfo />
          {authentication.userId === creator._id &&
            <MUICard>
              <MUICardContent>
                <ScryfallRequest
                  buttonText="Add it!"
                  labelText={`Add a card to ${cubeState.active_component_name}`}
                  onSubmit={addCard}
                />
              </MUICardContent>
            </MUICard>
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