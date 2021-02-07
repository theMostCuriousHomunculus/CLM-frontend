import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import { actionCreators } from '../store/actions/cube-actions';
import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
import CurveView from '../components/Cube Page/CurveView';
import HoverPreview from '../components/miscellaneous/HoverPreview';
import ListView from '../components/Cube Page/ListView';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import TableView from '../components/Cube Page/TableView';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  paper: {
    margin: '0 8px 0 8px',
    padding: 8
  }
});

const Cube = (props) => {

  const {
    activeComponentId,
    activeComponentName,
    creator,
    dispatchAddCard,
    dispatchInitializeCube,
    viewMode
  } = props;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [loading, setLoading] = React.useState(true);
  const { sendRequest } = useRequest();

  React.useEffect(() => {
    const fetchCube = async function () {
      try {
        const cubeData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`, 'GET', null, {});
        dispatchInitializeCube(cubeData);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchCube();
  }, [cubeId, dispatchInitializeCube, sendRequest]);

  async function addCard (chosenCard) {
    delete chosenCard.art_crop;
    try {
      const cardData = JSON.stringify({
        ...chosenCard,
        action: 'add_card',
        component: activeComponentId
      });

      const newCardId = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        cardData,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      dispatchAddCard({ ...chosenCard, _id: newCardId });

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  const ScryfallRequestHackyWorkAround = (props2) => {
    return (
      <MUIPaper className={classes.paper}>
        <ScryfallRequest
          buttonText="Add it!"
          labelText={`Add a card to ${activeComponentName}`}
          onSubmit={addCard}
          {...props2}
        />
      </MUIPaper>
    );
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>
          <CubeInfo />

          <ComponentInfo />

          <HoverPreview marginBottom={190}>

            {authentication.userId === creator._id &&
              <ScryfallRequestHackyWorkAround />
            }

            {viewMode === 'Curve' &&
              <CurveView />
            }
            {viewMode === 'List' &&
              <ListView />
            }
            {viewMode === 'Table' &&
              <TableView />
            }

          </HoverPreview>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

function mapStateToProps (state) {
  return {
    activeComponentId: state.active_component_id,
    activeComponentName: state.active_component_name,
    creator: state.cube.creator,
    viewMode: state.view_mode
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchAddCard: (payload) => dispatch(actionCreators.add_card(payload)),
    dispatchInitializeCube: (payload) => dispatch(actionCreators.initialize_cube(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cube);