import React, { useContext, useRef, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIPaper from '@mui/material/Paper';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import AutoScrollMessages from '../miscellaneous/AutoScrollMessages';
import Avatar from '../miscellaneous/Avatar';
import createConversationMessage from '../../graphql/mutations/conversation/create-conversation-message';
import { AuthenticationContext } from '../../contexts/Authentication';
import { primaryColor, secondaryColor } from '../../theme';

const useStyles = makeStyles({
  messageDialog: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh'
  },
  messageDialogActions: {
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  messageDialogContent: {
    flexGrow: 1,
    marginRight: 16,
    overflowY: 'auto'
  },
  messageLI: {
    display: 'flex',
    margin: '4px 0'
  },
  messagesUL: {
    display: 'flex',
    flexDirection: 'column'
  },
  submitButton: {
    marginLeft: 8
  }
});

export default function ChatDialog({ conversation: { _id, messages, participants } }) {
  const { abortControllerRef, userID } = useContext(AuthenticationContext);
  const newMessageRef = useRef();
  const [newMessageText, setNewMessageText] = useState('');
  const {
    messageDialog,
    messageDialogActions,
    messageDialogContent,
    messageLI,
    messagesUL,
    submitButton
  } = useStyles();

  return (
    <MUIDialog className={messageDialog}>
      <MUIDialogTitle></MUIDialogTitle>
      <MUIDialogContent className={messageDialogContent}>
        {/* <AutoScrollMessages
          messages={messages}
          submitFunction={(value) => {
            createConversationMessage({
              headers: _id ? { ConversationID: _id } : undefined,
              variables: {
                body: value,
                participants: participants
              }
            });
          }}
          title={participants.map((participant) => participant.name).join(', ')}
        /> */}
        <ul className={messagesUL}>
          {messages
            .map((message, index, array) => array[array.length - 1 - index])
            .map((message) => (
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
          fullWidth
          inputRef={newMessageRef}
          multiline
          onChange={(event) => {
            if (event.target.value !== '\n') {
              setNewMessageText(event.target.value);
            }
          }}
          onKeyDown={(event) => {
            if (!event.shiftKey && event.key === 'Enter' && newMessageText.length > 0) {
              createConversationMessage({
                headers: _id ? { ConversationID: _id } : undefined,
                variables: {
                  body: newMessageText,
                  participants: participants
                }
              });
              setNewMessageText('');
              newMessageRef.current.focus();
            }
          }}
          rows={2}
          type="text"
          value={newMessageText}
        />
        <MUIButton
          className={submitButton}
          disabled={newMessageText.length === 0}
          onClick={() => {
            if (newMessageText.length > 0) {
              createConversationMessage({
                headers: _id ? { ConversationID: _id } : undefined,
                variables: {
                  body: newMessageText,
                  participants: participants
                }
              });
            }
            setNewMessageText('');
            newMessageRef.current.focus();
          }}
          startIcon={<MUIAddCommentOutlinedIcon />}
        >
          Send
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}
