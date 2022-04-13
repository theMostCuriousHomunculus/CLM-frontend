import React, { useContext, useEffect, useState } from 'react';
import MUIPaper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';

import addCardToCube from '../graphql/mutations/cube/add-card-to-cube';
import CubeDashboard from '../components/Cube Page/CubeDashboard';
import CubeDisplay from '../components/Cube Page/CubeDisplay';
import EditCardModal from '../components/Cube Page/EditCardModal';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AuthenticationContext } from '../contexts/Authentication';
import { CubeContext } from '../contexts/cube-context';

export default function Cube() {
  const { userID } = useContext(AuthenticationContext);
  const { activeComponentState, cubeState } = useContext(CubeContext);
  const { cubeID } = useParams();
  const [editable, setEditable] = useState(cubeState.creator._id === userID);
  const [selectedCard, setSelectedCard] = useState();

  useEffect(() => {
    setEditable(cubeState.creator._id === userID);
  }, [cubeState.creator._id, userID]);

  return (
    <React.Fragment>
      {selectedCard && (
        <EditCardModal card={selectedCard} clear={() => setSelectedCard()} editable={editable} />
      )}

      <CubeDashboard />

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
            onSubmit={(cardData) =>
              addCardToCube({
                headers: { CubeID: cubeID },
                variables: {
                  componentID: activeComponentState._id,
                  scryfall_id: cardData._id
                }
              })
            }
          />
        </MUIPaper>
      )}

      <CubeDisplay setSelectedCard={setSelectedCard} />
    </React.Fragment>
  );
}
