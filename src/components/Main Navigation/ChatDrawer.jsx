import React, { useContext, useEffect, useState } from 'react';
import MUIAddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MUIAvatarGroup from '@mui/material/AvatarGroup';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIDrawer from '@mui/material/Drawer';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import Avatar from '../miscellaneous/Avatar';
import ChatDialog from './ChatDialog';
import ParticipantsInput from './ParticipantsInput';
import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  columnFlex: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 8
  },
  conversationCard: {
    backgroundColor: 'transparent',
    border: '2px solid white',
    cursor: 'pointer',
    margin: 0
  }
});

function ConversationMapItem({ conversation, setSelectedConversationID }) {
  const { userID } = useContext(AuthenticationContext);
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const { conversationCard } = useStyles();

  conversation.participants.sort((a, b) => {
    if (a._id === userID) return -1;
    if (b._id === userID) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 1;
  });

  return (
    <MUICard
      className={conversationCard}
      onClick={() => setSelectedConversationID(conversation._id)}
    >
      <MUICardHeader
        avatar={
          <MUIAvatarGroup max={3}>
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
  const { avatar, conversations, userID, userName } = useContext(AuthenticationContext);
  const [existingConversationParticipants, setExistingConversationParticipants] = useState([]);
  const [newConversationParticipants, setNewConversationParticipants] = useState([]);
  const [selectedConversationID, setSelectedConversationID] = useState();
  const { columnFlex, conversationCard } = useStyles();

  const filteredConversations = conversations.filter((conversation) =>
    existingConversationParticipants.every((ecp) =>
      conversation.participants.some((cp) => ecp._id === cp._id)
    )
  );

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
        <div className={columnFlex} style={{ width: 300 }}>
          <ParticipantsInput
            faded
            participants={existingConversationParticipants}
            setParticipants={setExistingConversationParticipants}
          />
          <div style={{ flexGrow: 1, flexShrink: 1, overflowY: 'auto' }}>
            <div className={columnFlex}>
              {!filteredConversations.find(
                (fc) => fc.participants.length - 1 === existingConversationParticipants.length
              ) && (
                <MUICard
                  className={conversationCard}
                  onClick={() => {
                    setExistingConversationParticipants([]);
                    setNewConversationParticipants([
                      ...existingConversationParticipants,
                      { _id: userID, avatar, name: userName }
                    ]);
                  }}
                >
                  <MUICardHeader
                    avatar={
                      <MUIAvatarGroup max={3}>
                        {existingConversationParticipants.map((participant) => (
                          <Avatar key={participant._id} profile={participant} />
                        ))}
                      </MUIAvatarGroup>
                    }
                    style={{ backgroundColor: 'transparent' }}
                    title={
                      <MUITypography color="white" variant="subtitle1">
                        {existingConversationParticipants
                          .map((participant) => participant.name)
                          .join(', ')}
                      </MUITypography>
                    }
                  />
                  <MUICardContent
                    style={{
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      columnGap: 8,
                      display: 'flex'
                    }}
                  >
                    <MUIAddCircleOutlineIcon style={{ color: 'white' }} />
                    <MUITypography color="white" variant="body1">
                      New Conversation
                    </MUITypography>
                  </MUICardContent>
                </MUICard>
              )}
              {filteredConversations
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
          </div>
        </div>
      </MUIDrawer>
    </React.Fragment>
  );
}
