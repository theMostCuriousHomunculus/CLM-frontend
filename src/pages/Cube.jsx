import React from 'react';
import MUIPaper from '@mui/material/Paper';
import { createClient } from 'graphql-ws';

import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeDisplay from '../components/Cube Page/CubeDisplay';
import CubeInfo from '../components/Cube Page/CubeInfo';
import EditCardModal from '../components/Cube Page/EditCardModal';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AuthenticationContext } from '../contexts/authentication-context';
import { CubeContext } from '../contexts/cube-context';

export default function Cube () {

  const { token, userId } = React.useContext(AuthenticationContext);
  const {
    loading,
    activeComponentState,
    cubeQuery,
    cubeState,
    setCubeState,
    addCardToCube,
    deleteCard,
    editCard,
    fetchCubeByID
  } = React.useContext(CubeContext);
  const editable = cubeState.creator._id === userId;
  const [selectedCard, setSelectedCard] = React.useState();

  React.useEffect(() => {

    async function initialize () {
      await fetchCubeByID();
    }

    initialize();

    const client = createClient({
      connectionParams: {
        authToken: token,
        cubeID: cubeState._id
      },
      url: process.env.REACT_APP_GRAPHQL_WS_URL
    });

    async function subscribe () {
      function onNext(update) {
        setCubeState(update.data.subscribeCube);
      }

      await new Promise((resolve, reject) => {
        client.subscribe({
          query: `subscription {
            subscribeCube {
              ${cubeQuery}
            }
          }`
        },
        {
          complete: resolve,
          error: reject,
          next: onNext
        });
      });
    }

    subscribe(result => console.log(result), error => console.log(error));

    return client.dispose;
  }, [token, cubeQuery, cubeState._id, fetchCubeByID, setCubeState]);

  return (
    loading ?
      <LoadingSpinner /> :
      <React.Fragment>
        {selectedCard &&
          <EditCardModal
            activeComponentID={activeComponentState._id}
            activeComponentName={activeComponentState.name}
            card={selectedCard}
            clear={() => setSelectedCard()}
            deleteCard={deleteCard}
            editable={editable}
            editCard={editCard}
            modules={cubeState.modules.map(module => ({ _id: module._id, name: module.name }))}
            rotations={cubeState.rotations.map(rotation => ({ _id: rotation._id, name: rotation.name }))}
          />
        }

        <CubeInfo />

        <ComponentInfo />

        {editable &&
          <MUIPaper
            style={{
              padding: '0 4px',
              position: 'sticky',
              top: 4
            }}
          >
            <ScryfallRequest
              buttonText="Add it!"
              labelText={`Add a card to ${activeComponentState.name}`}
              onSubmit={addCardToCube}
            />
          </MUIPaper>
        }

        <CubeDisplay setSelectedCard={setSelectedCard} />

      </React.Fragment>
  );
};