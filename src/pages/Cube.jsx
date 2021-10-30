import React from 'react';
import MUIPaper from '@mui/material/Paper';

import CubeDisplay from '../components/Cube Page/CubeDisplay';
import Dashboard from '../components/Cube Page/Dashboard';
import EditCardModal from '../components/Cube Page/EditCardModal';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AuthenticationContext } from '../contexts/authentication-context';
import { CubeContext } from '../contexts/cube-context';

export default function Cube() {
  const { userId } = React.useContext(AuthenticationContext);
  const { loading, activeComponentState, cubeState, addCardToCube } =
    React.useContext(CubeContext);
  const [editable, setEditable] = React.useState(
    cubeState.creator._id === userId
  );
  const [selectedCard, setSelectedCard] = React.useState();

  React.useEffect(() => {
    setEditable(cubeState.creator._id === userId);
  }, [cubeState.creator._id, userId]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      {selectedCard && (
        <EditCardModal
          card={selectedCard}
          clear={() => setSelectedCard()}
          editable={editable}
        />
      )}

      <Dashboard />

      {editable && (
        <MUIPaper
          style={{
            position: 'sticky',
            top: 4
          }}
        >
          <ScryfallRequest
            buttonText="Add to Cube"
            labelText={`Add a card to ${activeComponentState.name}`}
            onSubmit={addCardToCube}
          />
        </MUIPaper>
      )}

      <CubeDisplay setSelectedCard={setSelectedCard} />
    </React.Fragment>
  );
}
