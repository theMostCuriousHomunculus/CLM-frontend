import React, { useContext, useState, useRef } from 'react';
import MUIAddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIPaper from '@mui/material/Paper';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import Avatar from './Avatar.jsx';
import { AuthenticationContext } from '../../contexts/Authentication';
import { primaryColor, secondaryColor } from '../../theme.js';

const useStyles = makeStyles({
  messageCard: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh'
  },
  messageCardActions: {
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  messageCardContent: {
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

export default function AutoScrollMessages({ messages, submitFunction, title }) {
  const { isLoggedIn, userID } = useContext(AuthenticationContext);
  const newMessageRef = useRef();
  const [newMessageText, setNewMessageText] = useState('');
  const {
    messageCard,
    messageCardActions,
    messageCardContent,
    messageLI,
    messagesUL,
    submitButton
  } = useStyles();

  return (
    <MUICard className={messageCard}>
      <MUICardHeader title={<MUITypography variant="h3">{title}</MUITypography>} />
      <MUICardContent className={messageCardContent}>
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
                <Avatar
                  alt={message.author.name}
                  size="small"
                  src={
                    message.author.avatar.image_uris?.art_crop ??
                    message.author.avatar.card_faces[0].image_uris.art_crop
                  }
                />
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
      </MUICardContent>
      {isLoggedIn && (
        <MUICardActions className={messageCardActions}>
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
                submitFunction(newMessageText);
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
                submitFunction(newMessageText);
              }
              setNewMessageText('');
              newMessageRef.current.focus();
            }}
            startIcon={<MUIAddCommentOutlinedIcon />}
          >
            Preach!
          </MUIButton>
        </MUICardActions>
      )}
    </MUICard>
  );
}
