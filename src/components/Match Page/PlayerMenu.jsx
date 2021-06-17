import React from 'react';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

import { AuthenticationContext } from '../../contexts/authentication-context';

export default function PlayerMenu ({
  bottomPlayer,
  clickedPlayer,
  displayedZones,
  handleAdjustEnergyCounters,
  handleAdjustLifeTotal,
  handleAdjustPoisonCounters,
  setClickedPlayer,
  setDisplayedZones,
  setNumberInputDialogInfo,
  setZoneName
}) {

  const authentication = React.useContext(AuthenticationContext);

  return (
    <MUIMenu
      anchorEl={clickedPlayer.anchorElement}
      keepMounted
      open={Boolean(clickedPlayer.anchorElement)}
      onClose={() => setClickedPlayer({
        _id: null,
        anchorElement: null,
        position: null
      })}
    >

      {clickedPlayer._id === authentication.userId &&
        <React.Fragment>
          <MUIMenuItem
            onClick={() => {
              setClickedPlayer({
                _id: null,
                anchorElement: null,
                position: null
              });
              setNumberInputDialogInfo({
                buttonText: "Update",
                defaultValue: bottomPlayer.energy,
                inputLabel: "Energy",
                title: "Update Your Energy Counters",
                updateFunction: (updatedValue) => handleAdjustEnergyCounters(updatedValue)
              });
            }}
          >
            Adjust Energy Counters
          </MUIMenuItem>

          <MUIMenuItem
            onClick={() => {
              setClickedPlayer({
                _id: null,
                anchorElement: null,
                position: null
              });
              setNumberInputDialogInfo({
                buttonText: "Update",
                defaultValue: bottomPlayer.life,
                inputLabel: "Life",
                title: "Update Your Life Total",
                updateFunction: (updatedValue) => handleAdjustLifeTotal(updatedValue)
              });
            }}
          >
            Adjust Life Total
          </MUIMenuItem>
          <MUIMenuItem
            onClick={() => {
              setClickedPlayer({
                _id: null,
                anchorElement: null,
                position: null
              });
              setNumberInputDialogInfo({
                buttonText: "Update",
                defaultValue: bottomPlayer.poison,
                inputLabel: "Poison",
                title: "Update Your Poison Counters",
                updateFunction: (updatedValue) => handleAdjustPoisonCounters(updatedValue)
              });
            }}
          >
            Adjust Poison Counters
          </MUIMenuItem>
          <hr/>
        </React.Fragment>
      }

      <MUIMenuItem
        onClick={() => {

          if (clickedPlayer.position === 'bottom') {
            setDisplayedZones(prevState => ({
              ...prevState,
              bottomExile: !prevState.bottomExile
            }));
          }
          
          if (clickedPlayer.position === 'top') {
            setDisplayedZones(prevState => ({
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
        {clickedPlayer.position === 'bottom' && (displayedZones.bottomExile ? "Hide Exile Zone" : "Inspect Exile Zone")}
        {clickedPlayer.position === 'top' && (displayedZones.topExile ? "Hide Exile Zone" : "Inspect Exile Zone")}
      </MUIMenuItem>
      <MUIMenuItem
        onClick={() => {
          
          if (clickedPlayer.position === 'bottom') {
            setDisplayedZones(prevState => ({
              ...prevState,
              bottomGraveyard: !prevState.bottomGraveyard
            }));
          }
          
          if (clickedPlayer.position === 'top') {
            setDisplayedZones(prevState => ({
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
        {clickedPlayer.position === 'bottom' && (displayedZones.bottomGraveyard ? "Hide Graveyard" : "Inspect Graveyard")}
        {clickedPlayer.position === 'top' && (displayedZones.topGraveyard ? "Hide Graveyard" : "Inspect Graveyard")}
      </MUIMenuItem>
      <MUIMenuItem
        onClick={() => {

          if (clickedPlayer.position === 'bottom') {
            setDisplayedZones(prevState => ({
              ...prevState,
              bottomLibrary: !prevState.bottomLibrary
            }));
          }
          
          if (clickedPlayer.position === 'top') {
            setDisplayedZones(prevState => ({
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
        {clickedPlayer.position === 'bottom' && (displayedZones.bottomLibrary ? "Hide Library" : "Inspect Library")}
        {clickedPlayer.position === 'top' && (displayedZones.topLibrary ? "Hide Library" : "Inspect Library")}
      </MUIMenuItem>

      {clickedPlayer._id === authentication.userId &&
        <MUIMenuItem
          onClick={() => {
            setClickedPlayer(prevState => ({
              ...prevState,
              anchorElement: null
            }));
            setZoneName('sideboard');
          }}
        >
          Inspect Sideboard
        </MUIMenuItem>
      }

      <MUIMenuItem
        onClick={() => {
          setClickedPlayer(prevState => ({
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
};