import React, { useContext, useEffect, useState } from 'react';
import MUIAvatarGroup from '@mui/material/AvatarGroup';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIDrawer from '@mui/material/Drawer';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import Avatar from '../miscellaneous/Avatar';
import ChatDialog from './ChatDialog';
import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  chatDrawerSection: {
    maxHeight: 'calc(50vh - 12px)',
    maxWidth: 350,
    overflowY: 'auto'
  },
  columnFlex: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 8
  },
  stickyHeading: {
    backdropFilter: 'blur(2px)',
    margin: '0 2px',
    position: 'sticky',
    textAlign: 'center',
    top: 0,
    // to be above avatar which has z-index of 1200
    zIndex: 1300
  }
});

function ConversationMapItem({ conversation, setSelectedConversationID }) {
  const { userID } = useContext(AuthenticationContext);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  conversation.participants.sort((a, b) => {
    if (a._id === userID) return -1;
    if (b._id === userID) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 1;
  });

  return (
    <MUICard
      onClick={() => setSelectedConversationID(conversation._id)}
      style={{
        backgroundColor: 'transparent',
        border: '2px solid white',
        cursor: 'pointer',
        margin: 0
      }}
    >
      <MUICardHeader
        avatar={
          <MUIAvatarGroup max={4}>
            {conversation.participants
              .filter((participant) => participant._id !== userID)
              .map((participant) => (
                <Avatar key={participant._id} profile={participant} />
              ))}
          </MUIAvatarGroup>
        }
        style={{ backgroundColor: 'transparent' }}
        title={
          <MUITypography color="white" variant="subtitle1">
            {conversation.participants
              .filter((participant) => participant._id !== userID)
              .map((participant) => participant.name)
              .join(', ')}
          </MUITypography>
        }
      />
      <MUICardContent style={{ backgroundColor: 'transparent' }}>
        <MUITypography color="white" variant="body1">
          {lastMessage.body.substring(0, 100).concat(lastMessage.body.length > 100 ? '...' : '')}
        </MUITypography>
        <MUITypography color="white" component="p" textAlign="right" variant="caption">
          {`— ${lastMessage.author.name}, ${new Date(
            parseInt(lastMessage.createdAt)
          ).toLocaleString()}`}
        </MUITypography>
      </MUICardContent>
    </MUICard>
  );
}

export default function ChatDrawer({ chatDrawerOpen, setChatDrawerOpen }) {
  const { avatar, buds, conversations, userID, userName } = useContext(AuthenticationContext);
  const [newConversationParticipants, setNewConversationParticipants] = useState([]);
  const [selectedConversationID, setSelectedConversationID] = useState();
  const { chatDrawerSection, columnFlex, stickyHeading } = useStyles();

  useEffect(() => {
    const existingConversation = conversations.find(
      (conversation) =>
        conversation.participants.length === newConversationParticipants.length &&
        conversation.participants.every((cp) =>
          newConversationParticipants.some((ncp) => ncp._id === cp._id)
        )
    );

    if (existingConversation) {
      setSelectedConversationID(existingConversation._id);
    } else {
      setSelectedConversationID(null);
    }
  }, [newConversationParticipants]);

  return (
    <React.Fragment>
      <ChatDialog
        close={() => {
          setNewConversationParticipants([]);
          setSelectedConversationID(null);
        }}
        conversation={(() => {
          if (selectedConversationID) {
            return conversations.find(
              (conversation) => conversation._id === selectedConversationID
            );
          }
          if (newConversationParticipants.length > 0) {
            return { messages: [], participants: newConversationParticipants };
          }
          return null;
        })()}
        open={!!selectedConversationID || newConversationParticipants.length > 0}
        setNewConversationParticipants={setNewConversationParticipants}
        setSelectedConversationID={setSelectedConversationID}
      />

      <MUIDrawer
        anchor="right"
        id="side-navigation"
        onClose={() => setChatDrawerOpen(false)}
        open={chatDrawerOpen}
      >
        <div className={columnFlex}>
          <div className={chatDrawerSection}>
            <MUITypography className={stickyHeading} color="white" variant="h3">
              Buds
            </MUITypography>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8
              }}
            >
              {buds.map((bud) => (
                <Avatar
                  key={bud._id}
                  onClick={() => {
                    const existingConversation = conversations.find(
                      (conversation) =>
                        conversation.participants.length === 2 &&
                        conversation.participants.some((participant) => participant._id === bud._id)
                    );

                    if (existingConversation) {
                      setSelectedConversationID(existingConversation._id);
                    } else {
                      setNewConversationParticipants([
                        { _id: userID, avatar, name: userName },
                        { _id: bud._id, avatar: bud.avatar, name: bud.name }
                      ]);
                    }
                  }}
                  profile={{ avatar: bud.avatar, name: bud.name }}
                  size="medium"
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
          <div className={chatDrawerSection}>
            <MUITypography className={stickyHeading} color="white" variant="h3">
              Conversations
            </MUITypography>
            {conversations.length > 0 ? (
              <div className={columnFlex}>
                {conversations
                  .sort((a, b) => {
                    if (
                      parseInt(a.messages[a.messages.length - 1].createdAt) >
                      parseInt(b.messages[b.messages.length - 1].createdAt)
                    ) {
                      return -1;
                    }
                    return 1;
                  })
                  .map((conversation) => (
                    <ConversationMapItem
                      conversation={conversation}
                      key={conversation._id}
                      setSelectedConversationID={setSelectedConversationID}
                    />
                  ))}
              </div>
            ) : (
              <MUITypography color="white" variant="body1">
                No Conversations Yet...
              </MUITypography>
            )}
          </div>
        </div>
      </MUIDrawer>
    </React.Fragment>
  );
}
