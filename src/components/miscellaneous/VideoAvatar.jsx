import React, { useContext, useEffect, useRef, useState } from 'react';
import MUIBadge from '@mui/material/Badge';
import MUIMicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MUIMicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import MUIVideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MUIVideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import AudioStream from '../miscellaneous/AudioStream';
import Avatar from '../miscellaneous/Avatar';
import VideoStream from '../miscellaneous/VideoStream';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';

const useStyles = makeStyles({
  badge: {
    '& > .MuiBadge-badge': {
      borderRadius: '100%',
      color: 'white',
      cursor: 'pointer',
      height: 36,
      padding: 4,
      width: 36
    }
  },
  badgeIcon: {
    height: 24,
    width: 24
  }
});

export default function VideoAvatar({ account, context, rtcConnectionIndex, size }) {
  const { userID } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const { peerConnectionsRef } = useContext(context);
  const [audioAvailable, setAudioAvailable] = useState(account._id === userID);
  const [audioEnabled, setAudioEnabled] = useState(account._id !== userID);
  const [videoAvailable, setVideoAvailable] = useState(account._id === userID);
  const [videoEnabled, setVideoEnabled] = useState(account._id !== userID);
  const mediaStreamRef = useRef();
  const audioSendersRef = useRef([]);
  const videoSendersRef = useRef([]);
  const audioBadge = useRef();
  const videoBadge = useRef();
  const classes = useStyles();
  const audioTracks = !!mediaStreamRef.current ? mediaStreamRef.current.getAudioTracks() : [];
  const videoTracks = !!mediaStreamRef.current ? mediaStreamRef.current.getVideoTracks() : [];
  const pc = peerConnectionsRef.current[rtcConnectionIndex];

  async function toggleAudio() {
    if (account._id === userID) {
      try {
        if (!!mediaStreamRef.current) {
          if (audioTracks.length === 0) {
            const microphoneStream = await navigator.mediaDevices.getUserMedia({
              audio: true
            });
            for (let index = 0; index < peerConnectionsRef.current.length; index++) {
              if (peerConnectionsRef.current[index]) {
                audioSendersRef.current[index] = peerConnectionsRef.current[index].addTrack(
                  microphoneStream.getAudioTracks()[0]
                  // mediaStreamRef.current
                );
              }
            }
          } else {
            for (let index = 0; index < audioTracks.length; index++) {
              audioTracks[index].stop();
              mediaStreamRef.current.removeTrack(audioTracks[index]);
            }
            for (let index = 0; index < peerConnectionsRef.current.length; index++) {
              if (peerConnectionsRef.current[index]) {
                peerConnectionsRef.current[index].removeTrack(audioSendersRef.current[index]);
                audioSendersRef.current[index] = null;
              }
            }
            // if (videoTracks.length === 0) {
            //   mediaStreamRef.current = null;
            // }
          }
        } else {
          const microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
          });
          // mediaStreamRef.current = microphoneStream;
          for (let index = 0; index < peerConnectionsRef.current.length; index++) {
            if (peerConnectionsRef.current[index]) {
              audioSendersRef.current[index] = peerConnectionsRef.current[index].addTrack(
                microphoneStream.getAudioTracks()[0]
                // mediaStreamRef.current
              );
            }
          }
        }
        setAudioEnabled((prevState) => !prevState);
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      }
    } else {
      setAudioEnabled((prevState) => !prevState);
    }
  }

  async function toggleVideo() {
    if (account._id === userID) {
      try {
        if (!!mediaStreamRef.current) {
          if (videoTracks.length === 0) {
            const cameraStream = await navigator.mediaDevices.getUserMedia({
              video: true
            });
            for (let index = 0; index < peerConnectionsRef.current.length; index++) {
              if (peerConnectionsRef.current[index]) {
                videoSendersRef.current[index] = peerConnectionsRef.current[index].addTrack(
                  cameraStream.getVideoTracks()[0],
                  mediaStreamRef.current
                );
              }
            }
          } else {
            for (let index = 0; index < videoTracks.length; index++) {
              videoTracks[index].stop();
              mediaStreamRef.current.removeTrack(videoTracks[index]);
            }
            for (let index = 0; index < peerConnectionsRef.current.length; index++) {
              if (peerConnectionsRef.current[index]) {
                peerConnectionsRef.current[index].removeTrack(videoSendersRef.current[index]);
                videoSendersRef.current[index] = null;
              }
            }
            // if (audioTracks.length === 0) {
            //   mediaStreamRef.current = null;
            // }
          }
        } else {
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
          mediaStreamRef.current = cameraStream;
          for (let index = 0; index < peerConnectionsRef.current.length; index++) {
            if (peerConnectionsRef.current[index]) {
              videoSendersRef.current[index] = peerConnectionsRef.current[index].addTrack(
                mediaStreamRef.current.getVideoTracks()[0],
                mediaStreamRef.current
              );
            }
          }
        }
        setVideoEnabled((prevState) => !prevState);
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      }
    } else {
      setVideoEnabled((prevState) => !prevState);
    }
  }

  useEffect(() => {
    if (pc) {
      pc.ontrack = ({ track: addedTrack, streams }) => {
        addedTrack.onunmute = () => {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.addTrack(addedTrack);
          } else {
            mediaStreamRef.current = streams[0];
          }

          if (addedTrack.kind === 'audio') {
            setAudioAvailable(true);
          }
          if (addedTrack.kind === 'video') {
            setVideoAvailable(true);
          }
        };

        streams[0].onremovetrack = ({ track: removedTrack }) => {
          if (streams[0].getAudioTracks().length === 0) {
            setAudioAvailable(false);
          }
          if (streams[0].getVideoTracks().length === 0) {
            setVideoAvailable(false);
          }
        };
      };
    }
  }, []);

  if (!audioAvailable && !videoAvailable) {
    return (
      <Link to={`/account/${account._id}`}>
        <Avatar
          alt={account.name}
          src={
            account.avatar.image_uris?.art_crop ?? account.avatar.card_faces[0].image_uris.art_crop
          }
          style={{
            height: size,
            width: size
          }}
        />
      </Link>
    );
  } else if (audioAvailable && !videoAvailable) {
    return (
      <MUIBadge
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
        badgeContent={
          audioEnabled ? (
            <MUIMicOffOutlinedIcon className={classes.badgeIcon} />
          ) : (
            <MUIMicNoneOutlinedIcon className={classes.badgeIcon} />
          )
        }
        className={classes.badge}
        color="secondary"
        onClick={toggleAudio}
        overlap="circular"
        ref={audioBadge}
      >
        <Avatar
          alt={account.name}
          src={
            account.avatar.image_uris?.art_crop ?? account.avatar.card_faces[0].image_uris.art_crop
          }
          style={{
            height: size,
            width: size
          }}
        />
        <AudioStream
          autoPlay
          muted={!audioEnabled}
          srcObject={mediaStreamRef.current}
          style={{ display: 'none' }}
        />
      </MUIBadge>
    );
  } else if (!audioAvailable && videoAvailable) {
    return (
      <MUIBadge
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom'
        }}
        badgeContent={
          videoEnabled ? (
            <MUIVideocamOffOutlinedIcon className={classes.badgeIcon} />
          ) : (
            <MUIVideocamOutlinedIcon className={classes.badgeIcon} />
          )
        }
        className={classes.badge}
        color="primary"
        onClick={toggleVideo}
        overlap="circular"
        ref={videoBadge}
      >
        {videoEnabled ? (
          <VideoStream
            autoPlay
            height={size}
            playsInline
            srcObject={mediaStreamRef.current}
            style={{
              borderRadius: '100%',
              height: size,
              objectFit: 'cover',
              width: size
            }}
            width={size}
          />
        ) : (
          <Avatar
            alt={account.name}
            src={
              account.avatar.image_uris?.art_crop ??
              account.avatar.card_faces[0].image_uris.art_crop
            }
            style={{
              height: size,
              width: size
            }}
          />
        )}
      </MUIBadge>
    );
  } else {
    return (
      <MUIBadge
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom'
        }}
        badgeContent={
          videoEnabled ? (
            <MUIVideocamOffOutlinedIcon className={classes.badgeIcon} />
          ) : (
            <MUIVideocamOutlinedIcon className={classes.badgeIcon} />
          )
        }
        className={classes.badge}
        color="primary"
        onClick={(event) => {
          if (event.target.closest('span').classList.contains('MuiBadge-colorPrimary')) {
            toggleVideo();
          }
        }}
        overlap="circular"
        ref={videoBadge}
      >
        <MUIBadge
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom'
          }}
          badgeContent={
            audioEnabled ? (
              <MUIMicOffOutlinedIcon className={classes.badgeIcon} />
            ) : (
              <MUIMicNoneOutlinedIcon className={classes.badgeIcon} />
            )
          }
          className={classes.badge}
          color="secondary"
          onClick={async (event) => {
            event.persist();
            if (event.target.closest('span').classList.contains('MuiBadge-colorSecondary')) {
              toggleAudio();
            }
          }}
          overlap="circular"
          ref={audioBadge}
        >
          {videoEnabled ? (
            <VideoStream
              autoPlay
              height={size}
              playsInline
              srcObject={mediaStreamRef.current}
              style={{
                borderRadius: '100%',
                height: size,
                objectFit: 'cover',
                width: size
              }}
              width={size}
            />
          ) : (
            <React.Fragment>
              <Avatar
                alt={account.name}
                src={
                  account.avatar.image_uris?.art_crop ??
                  account.avatar.card_faces[0].image_uris.art_crop
                }
                style={{
                  height: size,
                  width: size
                }}
              />
              <AudioStream
                autoPlay
                muted={!audioEnabled}
                srcObject={mediaStreamRef.current}
                style={{ display: 'none' }}
              />
            </React.Fragment>
          )}
        </MUIBadge>
      </MUIBadge>
    );
  }
}
