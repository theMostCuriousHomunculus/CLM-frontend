import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
// import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
import CurveView from '../components/Cube Page/CurveView';
import HoverPreview from '../components/miscellaneous/HoverPreview';
import ListView from '../components/Cube Page/ListView';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import TableView from '../components/Cube Page/TableView';
import { actionCreators } from '../redux-store/actions/cube-actions';
import { addCard as addCardRequest, fetchCubeById } from '../requests/REST/cube-requests';
import { AuthenticationContext } from '../contexts/authentication-context';

function Cube ({
  activeComponentId,
  activeComponentName,
  creator,
  dispatchAddCard,
  dispatchInitializeCube,
  viewMode
}) {

  const authentication = React.useContext(AuthenticationContext);
  const cubeId = useParams().cubeId;
  const [loading, setLoading] = React.useState(true);

  const initializeCube = React.useCallback(async function () {
    try {
      setLoading(true);
      const response = await fetchCubeById(cubeId);
      dispatchInitializeCube(response);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, [cubeId, dispatchInitializeCube]);

  React.useEffect(() => {
    initializeCube();
  }, [initializeCube]);

  async function addCard (chosenCard) {
    delete chosenCard.art_crop;
    try {
      const newCardId = await addCardRequest(chosenCard, activeComponentId, cubeId, authentication.token);
      dispatchAddCard({ ...chosenCard, _id: newCardId._id });
    } catch (error) {
      console.log(error.message);
    }
  }

  const ScryfallRequestHackyWorkAround = (props) => {
    return (
      <MUIPaper>
        <ScryfallRequest
          buttonText="Add it!"
          labelText={`Add a card to ${activeComponentName}`}
          onSubmit={addCard}
          {...props}
        />
      </MUIPaper>
    );
  }

  return (
    loading ?
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