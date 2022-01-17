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

export default function VideoAvatar({ account, mediaStream, size }) {
  const { userID } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  // const [streamState, setStreamState] = useState(mediaStream);
  const [audioEnabled, setAudioEnabled] = useState(account._id !== userID);
  const [videoEnabled, setVideoEnabled] = useState(account._id !== userID);
  const mediaStreamRef = useRef(mediaStream);
  const audioBadge = useRef();
  const videoBadge = useRef();
  const classes = useStyles();
  // const videoTracks = !!streamState ? streamState.getVideoTracks() : [];
  // const audioTracks = !!streamState ? streamState.getAudioTracks() : [];
  const audioTracks = !!mediaStreamRef.current
    ? mediaStreamRef.current.getAudioTracks()
    : [];
  const videoTracks = !!mediaStreamRef.current
    ? mediaStreamRef.current.getVideoTracks()
    : [];

  async function toggleAudio() {
    // if (account._id === userID) {
    //   try {
    //     if (streamState) {
    //       if (audioTracks.length === 0) {
    //         const microphoneStream = await navigator.mediaDevices.getUserMedia({
    //           audio: true
    //         });
    //         setStreamState((prevState) => {
    //           const prevStateClone = prevState.clone();
    //           prevStateClone.addTrack(microphoneStream.getAudioTracks()[0]);
    //           prevState = null;
    //           return prevStateClone;
    //         });
    //       } else {
    //         setStreamState((prevState) => {
    //           if (prevState.getVideoTracks().length === 0) {
    //             prevState = null;
    //             return null;
    //           } else {
    //             const prevStateClone = prevState.clone();
    //             prevStateClone.getAudioTracks()[0].stop();
    //             prevStateClone.removeTrack(prevStateClone.getAudioTracks()[0]);
    //             prevState = null;
    //             return prevStateClone;
    //           }
    //         });
    //       }
    //     } else {
    //       const microphoneStream = await navigator.mediaDevices.getUserMedia({
    //         audio: true
    //       });
    //       setStreamState(microphoneStream);
    //     }

    //     // setMicrophoneEnabled((prevState) => !prevState);
    //   } catch (error) {
    //     setErrorMessages((prevState) => [...prevState, error.message]);
    //   }
    // } else {
    //   setStreamState((prevState) => {
    //     const prevStateClone = prevState.clone();
    //     const prevStateCloneAudioTracks = prevStateClone.getAudioTracks();
    //     prevStateCloneAudioTracks[0].enabled =
    //       !prevStateCloneAudioTracks[0].enabled;
    //     prevState = null;
    //     return prevStateClone;
    //   });
    // }
    if (account._id === userID) {
      try {
        if (!!mediaStreamRef.current) {
          if (audioTracks.length === 0) {
            const microphoneStream = await navigator.mediaDevices.getUserMedia({
              audio: true
            });
            mediaStreamRef.current.addTrack(
              microphoneStream.getAudioTracks()[0]
            );
          } else {
            audioTracks[0].stop();
            mediaStreamRef.current.removeTrack(audioTracks[0]);
            // if (videoTracks.length === 0) {
            //   mediaStreamRef.current = null;
            // }
          }
        } else {
          mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
            audio: true
          });
        }
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      }
    } else {
      audioTracks[0].enabled = !audioTracks[0].enabled;
    }

    setAudioEnabled((prevState) => !prevState);
  }

  async function toggleVideo() {
    // if (account._id === userID) {
    //   try {
    //     if (streamState) {
    //       if (videoTracks.length === 0) {
    //         const cameraStream = await navigator.mediaDevices.getUserMedia({
    //           video: true
    //         });
    //         setStreamState((prevState) => {
    //           const prevStateClone = prevState.clone();
    //           prevStateClone.addTrack(cameraStream.getVideoTracks()[0]);
    //           prevState = null;
    //           return prevStateClone;
    //         });
    //       } else {
    //         setStreamState((prevState) => {
    //           if (prevState.getAudioTracks().length === 0) {
    //             prevState = null;
    //             return null;
    //           } else {
    //             const prevStateClone = prevState.clone();
    //             prevStateClone.getVideoTracks()[0].stop();
    //             prevStateClone.removeTrack(prevStateClone.getVideoTracks()[0]);
    //             prevState = null;
    //             return prevStateClone;
    //           }
    //         });
    //       }
    //     } else {
    //       const cameraStream = await navigator.mediaDevices.getUserMedia({
    //         video: true
    //       });
    //       setStreamState(cameraStream);
    //     }

    //     // setCameraEnabled((prevState) => !prevState);
    //   } catch (error) {
    //     setErrorMessages((prevState) => [...prevState, error.message]);
    //   }
    // } else {
    //   setStreamState((prevState) => {
    //     const prevStateClone = prevState.clone();
    //     const prevStateCloneVideoTracks = prevStateClone.getVideoTracks();
    //     prevStateCloneVideoTracks[0].enabled =
    //       !prevStateCloneVideoTracks[0].enabled;
    //     prevState = null;
    //     return prevStateClone;
    //   });
    // }
    if (account._id === userID) {
      try {
        if (!!mediaStreamRef.current) {
          if (videoTracks.length === 0) {
            const cameraStream = await navigator.mediaDevices.getUserMedia({
              video: true
            });
            mediaStreamRef.current.addTrack(cameraStream.getVideoTracks()[0]);
          } else {
            videoTracks[0].stop();
            mediaStreamRef.current.removeTrack(videoTracks[0]);
            // if (audioTracks.length === 0) {
            //   mediaStreamRef.current = null;
            // }
          }
        } else {
          mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
            video: true
          });
        }
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      }
    } else {
      videoTracks[0].enabled = !videoTracks[0].enabled;
    }

    setVideoEnabled((prevState) => !prevState);
  }

  useEffect(() => {
    // the other user may mute their microphone or cut their video feed, so we need to update when changes come from outside this component.  but we also need to be careful not to override this user's mute selections for that other user
    // setStreamState((prevState) => {
    //   const mediaStreamClone = mediaStream ? mediaStream.clone() : null;

    //   if (!!mediaStreamClone) {
    //     const audioDisabledLocally = !prevState.getAudioTracks()[0].enabled;
    //     const videoDisabledLocally = !prevState.getVideoTracks()[0].enabled;

    //     if (audioDisabledLocally) {
    //       mediaStreamClone.getAudioTracks()[0].enabled = false;
    //     }

    //     if (videoDisabledLocally) {
    //       mediaStreamClone.getVideoTracks()[0].enabled = false;
    //     }
    //   }
    //   prevState = null;
    //   return mediaStreamClone;
    // });

    const clone = !!mediaStream ? mediaStream.clone() : new MediaStream();

    if (!audioEnabled && clone.getAudioTracks().length > 0) {
      clone.getAudioTracks()[0].enabled = false;
    }

    if (!videoEnabled && clone.getVideoTracks().length > 0) {
      clone.getVideoTracks()[0].enabled = false;
    }

    mediaStreamRef.current = clone;
  }, [mediaStream]);

  if (!mediaStreamRef.current && account._id !== userID) {
    return (
      <Link to={`/account/${account._id}`}>
        <Avatar
          alt={account.name}
          src={account.avatar}
          style={{
            height: size,
            width: size
          }}
        />
      </Link>
    );
  } else if (
    audioTracks.length > 0 &&
    videoTracks.length === 0 &&
    account._id !== userID
  ) {
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
          src={account.avatar}
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
  } else if (
    audioTracks.length === 0 &&
    videoTracks.length > 0 &&
    account._id !== userID
  ) {
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
            src={account.avatar}
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
          if (
            event.target
              .closest('span')
              .classList.contains('MuiBadge-colorPrimary')
          ) {
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
            if (
              event.target
                .closest('span')
                .classList.contains('MuiBadge-colorSecondary')
            ) {
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
                src={account.avatar}
                style={{
                  height: size,
                  width: size
                }}
              />
              {audioEnabled && (
                <AudioStream
                  autoPlay
                  muted={!audioEnabled}
                  srcObject={mediaStreamRef.current}
                  style={{ display: 'none' }}
                />
              )}
            </React.Fragment>
          )}
        </MUIBadge>
      </MUIBadge>
    );
  }
}
