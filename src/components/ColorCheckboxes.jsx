import React from 'react';
import MUICheckbox from '@material-ui/core/Checkbox';
import MUIGrid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  colorCheckbox: {
    padding: 0,
    '& .MuiIconButton-label': {
      height: 30,
      width: 30
    },
    '& input': {
      height: 30,
      width: 30
    },
    '& svg': {
      height: 30,
      width: 30
    }
  },
  manaSymbol: {
    height: 30,
    width: 30
  }
});

const ColorCheckboxes = (props) => {

  const authentication = React.useContext(AuthenticationContext);
  const { sendRequest } = useRequest();
  const classes = useStyles();
  const [whiteChecked, setWhiteChecked] = React.useState(props.color_identity.includes("W"));
  const [blueChecked, setBlueChecked] = React.useState(props.color_identity.includes("U"));
  const [blackChecked, setBlackChecked] = React.useState(props.color_identity.includes("B"));
  const [redChecked, setRedChecked] = React.useState(props.color_identity.includes("R"));
  const [greenChecked, setGreenChecked] = React.useState(props.color_identity.includes("G"));

  const colorObj = {
    "W": {
      "icon": "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/8/8e/W.svg?version=d74ba6b898f8815799b1506eb06fdf74",
      "state": whiteChecked,
      "updater": setWhiteChecked
    },
    "U": {
      "icon": "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/9/9f/U.svg?version=f798d6a151a43adc05e23e534adea262",
      "state": blueChecked,
      "updater": setBlueChecked
    },
    "B": {
      "icon": "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/2/2f/B.svg?version=ce85e9f6be68b450719ddd2f2ad08548",
      "state": blackChecked,
      "updater": setBlackChecked
    },
    "R": {
      "icon": "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/8/87/R.svg?version=60170f319a53b4c3410c43cdbb95699f",
      "state": redChecked,
      "updater": setRedChecked
    },
    "G": {
      "icon": "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/8/88/G.svg?version=cf85f35170391f8fbeb037dc18cc3c50",
      "state": greenChecked,
      "updater": setGreenChecked
    }
  };

  async function submitColorIdentityChange (color) {

    let color_identity = [];    
    for (let [key, value] of Object.entries(colorObj)) {
      // because state has not been updated yet
      if (key === color && !value.state) color_identity.push(key);
      if (key !== color && value.state) color_identity.push(key);
    }

    colorObj[color]['updater'](!colorObj[color]['state']);

    try {

      const cardChanges = JSON.stringify({
        action: 'edit_card',
        card_id: props.card_id,
        color_identity: color_identity.sort(),
        component: props.active_component_id,
        cube_id: props.cube_id
      });
      const updatedCube = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/`,
        'PATCH',
        cardChanges,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      props.updateCubeHandler(updatedCube);

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }
  
  return (
    <MUIGrid container justify="space-around">
    {Array.from(Object.keys(colorObj)).map(function (color) {
      return (
        <MUIGrid item key={`${color}-${props.card_id}`} style={{ alignItems: "center", display: "flex", justifyContent: "center" }} xs={4}>
          <MUICheckbox
            checked={colorObj[color]['state']}
            className={classes.colorCheckbox}
            color="primary"
            inputProps={{
              name: "color_identity[]"
            }}
            onChange={() => submitColorIdentityChange(color)}
            value={color}
          />
          <label style={{ height: 30, width: 30 }}>
            <img alt={color} className={classes.manaSymbol} src={colorObj[color]['icon']}></img>
          </label>
        </MUIGrid>
      );
    })}
  </MUIGrid>
  );
}

export default ColorCheckboxes;