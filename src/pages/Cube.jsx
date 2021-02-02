import React from 'react';
import { useParams } from 'react-router-dom';
import MUIPaper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
import CurveView from '../components/Cube Page/CurveView';
import HoverPreview from '../components/miscellaneous/HoverPreview';
import ListView from '../components/Cube Page/ListView';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import TableView from '../components/Cube Page/TableView';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useCube } from '../hooks/cube-hook';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  paper: {
    margin: '0 8px 0 8px',
    padding: 8
  }
});

const Cube = () => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [cubeState, dispatch] = useCube(true);
  const [loading, setLoading] = React.useState(true);
  const { sendRequest } = useRequest();

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

  const ScryfallRequestHackyWorkAround = (props) => {
    return (
      <MUIPaper className={classes.paper}>
        <ScryfallRequest
          buttonText="Add it!"
          labelText={`Add a card to ${cubeState.active_component_name}`}
          onSubmit={addCard}
          {...props}
        />
      </MUIPaper>
    );
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>

          <CubeInfo creator={cubeState.cube.creator} />

          <ComponentInfo />

          <HoverPreview marginBottom={190}>

            {authentication.userId === cubeState.cube.creator._id &&
              <ScryfallRequestHackyWorkAround />
            }

            {cubeState.view_mode === 'Curve' &&
              <CurveView />
            }
            {cubeState.view_mode === 'List' &&
              <ListView />
            }
            {cubeState.view_mode === 'Table' &&
              <TableView />
            }

          </HoverPreview>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default Cube;