import React from 'react';
import Draggable from 'react-draggable';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';

import theme from '../../theme';
import MagicCard from '../miscellaneous/MagicCard';
import { MatchContext } from '../../contexts/match-context';

export default function TheStack({ setRightClickedCard }) {
  const {
    matchState: { stack }
  } = React.useContext(MatchContext);

  return (
    <Draggable bounds="body" handle="#stack">
      <MUICard
        style={{
          backgroundColor: theme.palette.secondary.main,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '75vh',
          position: 'absolute',
          zIndex: 2147483646
        }}
      >
        <MUICardHeader
          id="stack"
          title="The Stack"
          style={{
            color: theme.palette.primary.main,
            cursor: 'move',
            textAlign: 'center'
          }}
        />
        <MUICardContent
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            overflowY: 'auto'
          }}
        >
          {stack.map((card) => (
            <MagicCard
              cardData={card}
              customStyle={{
                flexShrink: 0
              }}
              key={card._id}
              rightClickFunction={(event) => {
                event.preventDefault();
                setRightClickedCard({
                  _id: card._id,
                  anchorElement: event.currentTarget,
                  controller: card.controller._id,
                  face_down: card.face_down,
                  isCopyToken: card.isCopyToken,
                  name: card.name,
                  origin: 'stack',
                  owner: card.owner._id,
                  visibility: card.visibility
                });
              }}
            />
          ))}
        </MUICardContent>
      </MUICard>
    </Draggable>
  );
}
