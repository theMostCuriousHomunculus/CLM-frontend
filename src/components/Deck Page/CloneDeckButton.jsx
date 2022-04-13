import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUICloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import MUIFileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { useNavigate } from 'react-router-dom';

import cloneDeck from '../../graphql/mutations/deck/clone-deck';
import deckQuery from '../../constants/deck-query';
import { ErrorContext } from '../../contexts/Error';

export default function CloneDeckButton({ DeckID }) {
  const { setErrorMessages } = useContext(ErrorContext);
  const navigate = useNavigate();
  const [cloning, setCloning] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <MUIButton
      color={success ? 'success' : 'primary'}
      disabled={cloning}
      onClick={async () => {
        if (!success) {
          try {
            setCloning(true);
            const data = await cloneDeck({
              headers: { DeckID },
              queryString: deckQuery
            });
            setSuccess(true);
            setTimeout(() => {
              navigate(`/deck/${data.data.cloneDeck._id}`, {
                state: { deckData: data.data.cloneDeck }
              });
              setSuccess(false);
            }, 1000);
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          } finally {
            setCloning(false);
          }
        }
      }}
      startIcon={(() => {
        if (cloning) {
          return <MUICircularProgress size={13} style={{ color: 'inherit' }} />;
        }
        if (success) {
          return <MUICloudDoneOutlinedIcon />;
        }
        return <MUIFileCopyOutlinedIcon />;
      })()}
    >
      Clone Deck
    </MUIButton>
  );
}
