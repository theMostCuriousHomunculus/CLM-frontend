import React, { useContext, useRef, useState } from 'react';
import MUIAddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIPaper from '@mui/material/Paper';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import Avatar from '../miscellaneous/Avatar';
import ParticipantsInput from './ParticipantsInput';
import createConversationMessage from '../../graphql/mutations/conversation/create-conversation-message';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';
import { primaryColor, secondaryColor } from '../../theme';

const useStyles = makeStyles({
  messageDialog: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh'
  },
  messageDialogActions: {
    alignItems: 'stretch',
    columnGap: 8,
    flexDirection: 'row'
  },
  messageDialogContent: {
    flexGrow: 1,
    marginRight: 16,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  messageLI: {
    display: 'flex',
    margin: '4px 0'
  }
});

export default function ChatDialog({
  close,
  conversation,
  open,
  setNewConversationParticipants,
  setSelectedConversationID
}) {
  if (!conversation) return null;

  const { abortControllerRef, avatar, buds, userID, userName } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const newMessageRef = useRef();
  const [newMessageText, setNewMessageText] = useState('');
  const { messageDialog, messageDialogActions, messageDialogContent, messageLI } = useStyles();

  const { _id, messages, participants } = conversation;
  participants.sort((a, b) => {
    if (a._id === userID) return -1;
    if (b._id === userID) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 1;
  });

  return (
    <MUIDialog className={messageDialog} fullWidth maxWidth="xl" onClose={close} open={open}>
      <MUIDialogTitle>
        {_id ? (
          participants.map((participant) => participant.name).join(', ')
        ) : (
          <ParticipantsInput
            participants={participants}
            setNewConversationParticipants={setNewConversationParticipants}
          />
        )}
      </MUIDialogTitle>
      <MUIDialogContent className={messageDialogContent}>
        <ul>
          {messages.map((message) => (
            <li
              className={messageLI}
              key={message._id}
              style={{
                flexDirection: message.author._id === userID ? 'row-reverse' : 'row'
              }}
            >
              <Avatar profile={message.author} size="small" />
              <MUIPaper
                style={{
                  backgroundColor:
                    message.author._id === userID ? primaryColor['A100'] : secondaryColor['A100'],
                  minWidth: '50%',
                  overflowWrap: 'break-word',
                  textAlign: message.author._id === userID ? 'right' : 'left'
                }}
              >
                {message.body.split('\n').map((subString, index) => (
                  <MUITypography key={index} variant="body1">
                    {subString}
                  </MUITypography>
                ))}
                <MUITypography variant="caption">
                  {new Date(parseInt(message.createdAt)).toLocaleString()}
                </MUITypography>
              </MUIPaper>
            </li>
          ))}
        </ul>
      </MUIDialogContent>
      <MUIDialogActions className={messageDialogActions}>
        <MUITextField
          autoComplete="off"
          autoFocus
          fullWidth
          inputRef={newMessageRef}
          multiline
          onChange={(event) => {
            if (event.target.value !== '\n') {
              setNewMessageText(event.target.value);
            }
          }}
          onKeyDown={async (event) => {
            event.persist();
            try {
              if (!event.shiftKey && event.key === 'Enter' && newMessageText.length > 0) {
                const response = await createConversationMessage({
                  headers: _id ? { ConversationID: _id } : undefined,
                  queryString: `{\n_id\n}`,
                  signal: abortControllerRef.current.signal,
                  variables: {
                    body: newMessageText,
                    participants: participants.map((participant) => participant._id)
                  }
                });

                if (_id) {
                  setNewMessageText('');
                  newMessageRef.current.focus();
                } else {
                  setSelectedConversationID(response.data.createConversationMessage._id);
                  setNewConversationParticipants(null);
                }
              }
            } catch (error) {
              setErrorMessages((prevState) => [...prevState, error.message]);
            }
          }}
          rows={2}
          type="text"
          value={newMessageText}
        />
        <MUIButton
          disabled={newMessageText.length === 0}
          onClick={async () => {
            try {
              if (newMessageText.length > 0) {
                const response = await createConversationMessage({
                  headers: _id ? { ConversationID: _id } : undefined,
                  queryString: `{\n_id\n}`,
                  signal: abortControllerRef.current.signal,
                  variables: {
                    body: newMessageText,
                    participants: participants.map((participant) => participant._id)
                  }
                });

                if (_id) {
                  setNewMessageText('');
                  newMessageRef.current.focus();
                } else {
                  setSelectedConversationID(response.data.createConversationMessage._id);
                  setNewConversationParticipants(null);
                }
              }
            } catch (error) {
              setErrorMessages((prevState) => [...prevState, error.message]);
            }
          }}
          startIcon={<MUIAddCommentOutlinedIcon />}
        >
          Send
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}
