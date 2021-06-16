import React from 'react';
import Draggable from 'react-draggable';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITypography from '@material-ui/core/Typography';

import MagicCard from '../miscellaneous/MagicCard';
import theme from '../../theme';

export default function TheStack ({
  setRightClickedCard,
  stack
}) {

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
          disableTypography={true}
          id="stack"
          title={<MUITypography variant='h5'>The Stack</MUITypography>}
          style={{ color: theme.palette.primary.main, cursor: 'move', textAlign: 'center' }}
        />
        <MUICardContent style={{ display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto' }}>
          {stack.map(card => {
            return (
              <MagicCard
                cardData={card}
                key={card._id}
                rightClickFunction={(event) => {
                  event.preventDefault();
                  setRightClickedCard({
                    _id: card._id,
                    anchorElement: event.currentTarget,
                    origin: 'stack',
                    visibility: card.visibility
                  });
                }}
              />
            )
          })}
        </MUICardContent>
      </MUICard>
    </Draggable>
  );
};