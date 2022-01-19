import React, { useContext } from 'react';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUITypography from '@mui/material/Typography';

import VideoAvatar from '../miscellaneous/VideoAvatar';
import { EventContext } from '../../contexts/event-context';

export default function InfoSection() {
  const {
    eventState: { name, players },
    peerConnectionRef
  } = useContext(EventContext);

  return (
    <MUICard>
      <MUICardHeader
        title={<MUITypography variant="h2">{name}</MUITypography>}
      />
      <MUICardContent>
        <MUIGrid container justifyContent="space-around" spacing={0}>
          {players.map((player, index) => (
            <MUIGrid
              container
              item
              justifyContent="center"
              key={player.account._id}
              xs={6}
              sm={4}
              md={3}
              lg={2}
            >
              <VideoAvatar
                account={player.account}
                context={EventContext}
                // mediaStream={null}
                // peerConnectionRef={peerConnectionRef}
                rtcConnectionIndex={index}
                size={150}
              />
            </MUIGrid>
          ))}
        </MUIGrid>
      </MUICardContent>
    </MUICard>
  );
}
