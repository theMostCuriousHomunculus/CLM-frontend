import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
import CurveView from '../components/Cube Page/CurveView';
import ErrorDialog from '../components/miscellaneous/ErrorDialog';
import HoverPreview from '../components/miscellaneous/HoverPreview';
import ListView from '../components/Cube Page/ListView';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import TableView from '../components/Cube Page/TableView';
import { actionCreators } from '../store/actions/cube-actions';
import { addCard as addCardRequest, fetchCubeById } from '../requests/cube-requests';
import { AuthenticationContext } from '../contexts/authentication-context';

const useStyles = makeStyles({
  paper: {
    margin: '0 8px 0 8px',
    padding: 8
  }
});

function Cube (props) {

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
  const [errorMessage, setErrorMessage] = React.useState();
  const [loading, setLoading] = React.useState(true);

  const initializeCube = React.useCallback(async function () {
    try {
      setLoading(true);
      const response = await fetchCubeById(cubeId);
      dispatchInitializeCube(response);
    } catch (error) {
      setErrorMessage(error.message);
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
      setErrorMessage(error.message);
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

          <ErrorDialog
            clear={() => setErrorMessage(null)}
            message={errorMessage}
          />

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