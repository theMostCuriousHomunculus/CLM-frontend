import React, { useContext } from 'react';
import MUIBadge from '@mui/material/Badge';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUIMicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MUIMicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import MUITypography from '@mui/material/Typography';
import MUIVideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MUIVideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import AudioStream from '../miscellaneous/AudioStream';
import Avatar from '../miscellaneous/Avatar';
import VideoStream from '../miscellaneous/VideoStream';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';
import { EventContext } from '../../contexts/event-context';
import { PermissionsContext } from '../../contexts/Permissions';

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

export default function InfoSection() {
  const { localStream, peerConnection, setLocalStream, userID } = useContext(
    AuthenticationContext
  );
  const { setErrorMessages } = useContext(ErrorContext);
  const {
    eventState: { name, players }
  } = useContext(EventContext);
  const {
    cameraEnabled,
    cameraSupported,
    microphoneEnabled,
    microphoneSupported,
    setCameraEnabled,
    setMicrophoneEnabled
  } = useContext(PermissionsContext);
  const classes = useStyles();

  return (
    <MUICard>
      <MUICardHeader
        title={<MUITypography variant="h2">{name}</MUITypography>}
      />
      <MUICardContent>
        <MUIGrid container justifyContent="space-around" spacing={0}>
          {players.map((player) => (
            <MUIGrid
              container
              item
              justifyContent="center"
              key={player.account._id}
              xs={6}
              sm={3}
              md={1}
            >
              {player.account._id === userID &&
              cameraSupported &&
              microphoneSupported ? (
                <MUIBadge
                  anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom'
                  }}
                  badgeContent={
                    localStream && cameraEnabled ? (
                      <MUIVideocamOffOutlinedIcon
                        className={classes.badgeIcon}
                      />
                    ) : (
                      <MUIVideocamOutlinedIcon className={classes.badgeIcon} />
                    )
                  }
                  className={classes.badge}
                  color="primary"
                  onClick={async (event) => {
                    event.persist();
                    if (
                      event.target
                        .closest('span')
                        .classList.contains('MuiBadge-colorPrimary')
                    ) {
                      try {
                        if (localStream) {
                          const videoTracks = localStream.getVideoTracks();

                          if (videoTracks.length === 0) {
                            const cameraStream =
                              await navigator.mediaDevices.getUserMedia({
                                video: true
                              });
                            const videoTrack = cameraStream.getVideoTracks()[0];
                            localStream.addTrack(videoTrack);
                          } else {
                            videoTracks[0].stop();
                            localStream.removeTrack(videoTracks[0]);
                            const audioTracks = localStream.getAudioTracks();
                            if (audioTracks.length === 0) {
                              setLocalStream(null);
                            }
                          }
                        } else {
                          const cameraStream =
                            await navigator.mediaDevices.getUserMedia({
                              video: true
                            });
                          setLocalStream(cameraStream);
                          // localStream.getTracks().forEach((track) => {
                          //   peerConnection.current.addTrack(track, localStream);
                          // });
                          // peerConnection.ontrack = (event) => {
                          //   const newStream = new MediaStream();
                          //   event.streams[0].getTracks().forEach((track) => {
                          //     newStream.addTrack(track);
                          //   });
                          //   remoteStreams.current.push(newStream);
                          // }
                        }

                        setCameraEnabled((prevState) => !prevState);
                      } catch (error) {
                        setErrorMessages((prevState) => [
                          ...prevState,
                          error.message
                        ]);
                      }
                    }
                  }}
                  overlap="circular"
                >
                  <MUIBadge
                    anchorOrigin={{
                      horizontal: 'left',
                      vertical: 'bottom'
                    }}
                    badgeContent={
                      localStream && microphoneEnabled ? (
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
                        try {
                          if (localStream) {
                            const audioTracks = localStream.getAudioTracks();

                            if (audioTracks.length === 0) {
                              const microphoneStream =
                                await navigator.mediaDevices.getUserMedia({
                                  audio: true
                                });
                              const audioTrack =
                                microphoneStream.getAudioTracks()[0];
                              localStream.addTrack(audioTrack);
                            } else {
                              audioTracks[0].stop();
                              localStream.removeTrack(audioTracks[0]);
                              const videoTracks = localStream.getVideoTracks();
                              if (videoTracks.length === 0) {
                                setLocalStream(null);
                              }
                            }
                          } else {
                            const microphoneStream =
                              await navigator.mediaDevices.getUserMedia({
                                audio: true
                              });
                            setLocalStream(microphoneStream);
                          }

                          setMicrophoneEnabled((prevState) => !prevState);
                        } catch (error) {
                          setErrorMessages((prevState) => [
                            ...prevState,
                            error.message
                          ]);
                        }
                      }
                    }}
                    overlap="circular"
                  >
                    {localStream && cameraEnabled && (
                      <VideoStream
                        autoPlay
                        height={150}
                        playsInline
                        srcObject={localStream}
                        style={{
                          borderRadius: '100%',
                          height: 150,
                          objectFit: 'cover',
                          width: 150
                        }}
                        width={150}
                      />
                    )}
                    {((localStream && !cameraEnabled) || !localStream) && (
                      <Avatar
                        alt={player.account.name}
                        size="extraLarge"
                        src={player.account.avatar}
                      />
                    )}
                    {localStream && !cameraEnabled && (
                      <AudioStream
                        autoPlay
                        srcObject={localStream}
                        style={{ display: 'none' }}
                      />
                    )}
                  </MUIBadge>
                </MUIBadge>
              ) : (
                <Link to={`/account/${player.account._id}`}>
                  <Avatar
                    alt={player.account.name}
                    size="extraLarge"
                    src={player.account.avatar}
                  />
                </Link>
              )}
            </MUIGrid>
          ))}
        </MUIGrid>
      </MUICardContent>
    </MUICard>
  );
}
