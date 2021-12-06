import React from 'react';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';

import { AuthenticationContext } from '../../contexts/Authentication';
import { MatchContext } from '../../contexts/match-context';

export default function PlayerMenu({
  clickedPlayer,
  displayedZones,
  setClickedPlayer,
  setDisplayedZones,
  setZoneName
}) {
  const authentication = React.useContext(AuthenticationContext);
  const { viewZone } = React.useContext(MatchContext);

  return (
    <MUIMenu
      anchorEl={clickedPlayer.anchorElement}
      keepMounted
      open={Boolean(clickedPlayer.anchorElement)}
      onClose={() =>
        setClickedPlayer({
          _id: null,
          anchorElement: null,
          position: null
        })
      }
      style={{ zIndex: 2147483647 }}
    >
      <MUIMenuItem
        onClick={() => {
          if (clickedPlayer.position === 'bottom') {
            setDisplayedZones((prevState) => ({
              ...prevState,
              bottomExile: !prevState.bottomExile
            }));
          }

          if (clickedPlayer.position === 'top') {
            setDisplayedZones((prevState) => ({
              ...prevState,
              topExile: !prevState.topExile
            }));
          }

          setClickedPlayer({
            _id: null,
            anchorElement: null,
            position: null
          });
        }}
      >
        {clickedPlayer.position === 'bottom' &&
          (displayedZones.bottomExile
            ? 'Hide Exile Zone'
            : 'Inspect Exile Zone')}
        {clickedPlayer.position === 'top' &&
          (displayedZones.topExile ? 'Hide Exile Zone' : 'Inspect Exile Zone')}
      </MUIMenuItem>
      <MUIMenuItem
        onClick={() => {
          if (clickedPlayer.position === 'bottom') {
            setDisplayedZones((prevState) => ({
              ...prevState,
              bottomGraveyard: !prevState.bottomGraveyard
            }));
          }

          if (clickedPlayer.position === 'top') {
            setDisplayedZones((prevState) => ({
              ...prevState,
              topGraveyard: !prevState.topGraveyard
            }));
          }

          setClickedPlayer({
            _id: null,
            anchorElement: null,
            position: null
          });
        }}
      >
        {clickedPlayer.position === 'bottom' &&
          (displayedZones.bottomGraveyard
            ? 'Hide Graveyard'
            : 'Inspect Graveyard')}
        {clickedPlayer.position === 'top' &&
          (displayedZones.topGraveyard
            ? 'Hide Graveyard'
            : 'Inspect Graveyard')}
      </MUIMenuItem>
      <MUIMenuItem
        onClick={() => {
          if (clickedPlayer.position === 'bottom') {
            setDisplayedZones((prevState) => ({
              ...prevState,
              bottomHand: !prevState.bottomHand
            }));
          }

          if (clickedPlayer.position === 'top') {
            setDisplayedZones((prevState) => ({
              ...prevState,
              topHand: !prevState.topHand
            }));
          }

          setClickedPlayer({
            _id: null,
            anchorElement: null,
            position: null
          });
        }}
      >
        {clickedPlayer.position === 'bottom' &&
          (displayedZones.bottomHand ? 'Hide Hand' : 'Inspect Hand')}
        {clickedPlayer.position === 'top' &&
          (displayedZones.topHand ? 'Hide Hand' : 'Inspect Hand')}
      </MUIMenuItem>
      <MUIMenuItem
        onClick={() => {
          if (clickedPlayer.position === 'bottom') {
            setDisplayedZones((prevState) => ({
              ...prevState,
              bottomLibrary: !prevState.bottomLibrary
            }));
          }

          if (clickedPlayer.position === 'top') {
            setDisplayedZones((prevState) => ({
              ...prevState,
              topLibrary: !prevState.topLibrary
            }));
          }

          setClickedPlayer({
            _id: null,
            anchorElement: null,
            position: null
          });
        }}
      >
        {clickedPlayer.position === 'bottom' &&
          (displayedZones.bottomLibrary ? 'Hide Library' : 'Inspect Library')}
        {clickedPlayer.position === 'top' &&
          (displayedZones.topLibrary ? 'Hide Library' : 'Inspect Library')}
      </MUIMenuItem>
      <MUIMenuItem
        onClick={async () => {
          await viewZone(clickedPlayer._id, 'library');
          setClickedPlayer((prevState) => ({
            ...prevState,
            anchorElement: null
          }));
          setZoneName('library');
        }}
      >
        Search Library
      </MUIMenuItem>

      {clickedPlayer._id === authentication.userID && (
        <MUIMenuItem
          onClick={() => {
            setClickedPlayer((prevState) => ({
              ...prevState,
              anchorElement: null
            }));
            setZoneName('sideboard');
          }}
        >
          Inspect Sideboard
        </MUIMenuItem>
      )}

      <MUIMenuItem
        onClick={() => {
          setClickedPlayer((prevState) => ({
            ...prevState,
            anchorElement: null
          }));
          setZoneName('temporary');
        }}
      >
        Inspect Temporary Zone
      </MUIMenuItem>
    </MUIMenu>
  );
}
