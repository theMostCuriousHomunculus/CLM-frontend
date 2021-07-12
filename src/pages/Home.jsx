import React from 'react';
import { useHistory } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIComputerIcon from '@material-ui/icons/Computer';
import MUITypography from '@material-ui/core/Typography';
import MUIControlCameraIcon from '@material-ui/icons/ControlCamera';
import MUIPaletteIcon from '@material-ui/icons/Palette';
import MUITimerIcon from '@material-ui/icons/Timer';

export default function Home () {

  const history = useHistory();

  /*const components = [
    {
      description: "You can probably guess what the mainboard of your cube is; the cards you are happy with having show up in every draft.  These cards have a relatively high power level and do the types of things that most decks in that card's colors want to be doing.",
      type: 'Mainboard'
    },
    {
      description: "The sideboard is for cards you think are interesting and you might like to find a home in your cube at some point, but just don't quite know where or if they belong at the moment.  Stash cards in your sideboard so you don't forget about them and revisit this component every now and then to see if any of them are ready for prime time.",
      type: 'Sideboard'
    },
    {
      description: "A module is a collection of cards following a similar theme that are designed to either all be included in a draft or all excluded.  Modules are a great option if you'd like to support more narrow archetypes that would severely dilute the power and/or consistency of your cube if they were in your mainboard.  An example of a module you might be interested in building would be storm.  In order to function properly, a storm deck requires a high density of cards that other strategies are largely uninterested in.  Supporting storm in your mainboard limits the competition for cards during the draft and may not be an experience you wish to regularly offer your drafters, especially if you draft often.  With modules, you can give your playgroup the opportunity to try to draft these types of decks every once in a while, as not every module is included in every draft.",
      type: 'Module'
    },
    {
      description: "A rotation is a collection of cards with similar colors, mana costs and functions from which a specified number will be randomly included each time you draft your cube.  Rotations are a great way to help keep your cube feeling fresh.  As an example, a lower power level cube might be interested in some small number of cheap blue blockers being available in every draft.  However, there are a plethora of options and none are strictly better than the others.  With a rotation, Aegis Turtle might be included in one draft and the next might feature Fog Bank.  You specify the number of cards in each individual rotation that should be included in each draft.",
      type: 'Rotation'
    }
  ]*/

  return (
    <MUICard>
      <MUICardHeader title="A New Tool for Cube Curators" />
      <MUICardContent>
        <MUITypography variant="body1"><MUIControlCameraIcon /> Increased Control Over Your Cube</MUITypography>
        <MUITypography variant="body1"><MUIPaletteIcon /> Diverse Play Experiences</MUITypography>
        <MUITypography variant="body1"><MUITimerIcon /> Draft in Real Time with Your Buds</MUITypography>
        <MUITypography variant="body1"><MUIComputerIcon /> Export Draft Picks to CSV Files for Quick and Easy MTGO Play</MUITypography>
      </MUICardContent>
      <MUICardActions>
        <MUIButton
          color="primary"
          onClick={() => history.push('/cube/60e4a02d0347dc0017bfab0e')}
          size="small"
          variant="contained"
        >
          Casey's Cube
        </MUIButton>
      </MUICardActions>
    </MUICard>
  );
};