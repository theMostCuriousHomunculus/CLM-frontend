import React from 'react';
import { useParams } from 'react-router-dom';
import MUICheckbox from '@material-ui/core/Checkbox';
import MUIGrid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../../contexts/authentication-context';
import { useCube } from '../../hooks/cube-hook';
import { useRequest } from '../../hooks/request-hook';
import { ReactComponent as WhiteManaSymbol } from '../../images/white-mana-symbol.svg';
import { ReactComponent as BlueManaSymbol } from '../../images/blue-mana-symbol.svg';
import { ReactComponent as BlackManaSymbol } from '../../images/black-mana-symbol.svg';
import { ReactComponent as RedManaSymbol } from '../../images/red-mana-symbol.svg';
import { ReactComponent as GreenManaSymbol } from '../../images/green-mana-symbol.svg';

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

  const cubeId = useParams().cubeId;
  const authentication = React.useContext(AuthenticationContext);
  const [cubeState, dispatch] = useCube(true);
  const { sendRequest } = useRequest();
  const classes = useStyles();
  // const [whiteChecked, setWhiteChecked] = React.useState(props.color_identity.includes("W"));
  // const [blueChecked, setBlueChecked] = React.useState(props.color_identity.includes("U"));
  // const [blackChecked, setBlackChecked] = React.useState(props.color_identity.includes("B"));
  // const [redChecked, setRedChecked] = React.useState(props.color_identity.includes("R"));
  // const [greenChecked, setGreenChecked] = React.useState(props.color_identity.includes("G"));

  const colorObj = {
    "W": {
      "icon": <WhiteManaSymbol className={classes.manaSymbol} />,
      "state": /*whiteChecked*/props.color_identity.includes("W"),
      // "updater": setWhiteChecked
    },
    "U": {
      "icon": <BlueManaSymbol className={classes.manaSymbol} />,
      "state": /*blueChecked*/props.color_identity.includes("U"),
      // "updater": setBlueChecked
    },
    "B": {
      "icon": <BlackManaSymbol className={classes.manaSymbol} />,
      "state": /*blackChecked*/props.color_identity.includes("B"),
      // "updater": setBlackChecked
    },
    "R": {
      "icon": <RedManaSymbol className={classes.manaSymbol} />,
      "state": /*redChecked*/props.color_identity.includes("R"),
      // "updater": setRedChecked
    },
    "G": {
      "icon": <GreenManaSymbol className={classes.manaSymbol} />,
      "state": /*greenChecked*/props.color_identity.includes("G"),
      // "updater": setGreenChecked
    }
  };

  async function submitColorIdentityChange (color) {

    let color_identity = [];    
    for (let [key, value] of Object.entries(colorObj)) {
      // because state has not been updated yet
      if (key === color && !value.state) color_identity.push(key);
      if (key !== color && value.state) color_identity.push(key);
    }

    // colorObj[color]['updater'](!colorObj[color]['state']);

    try {
      const cardChanges = JSON.stringify({
        action: 'edit_card',
        card_id: props.card_id,
        color_identity: color_identity.sort(),
        component: cubeState.active_component_id
      });
      const updatedCube = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        cardChanges,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      dispatch('UPDATE_CUBE', updatedCube);

    } catch (error) {
      console.log(error);
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
            {colorObj[color]['icon']}
          </label>
        </MUIGrid>
      );
    })}
  </MUIGrid>
  );
}

export default React.memo(ColorCheckboxes);