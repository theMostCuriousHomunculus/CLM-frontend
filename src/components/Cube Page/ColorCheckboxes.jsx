import React from 'react';
import MUICheckbox from '@material-ui/core/Checkbox';
import MUIGrid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { monoColors } from '../../constants/color-objects';
import { ReactComponent as WhiteManaSymbol } from '../../svgs/white-mana-symbol.svg';
import { ReactComponent as BlueManaSymbol } from '../../svgs/blue-mana-symbol.svg';
import { ReactComponent as BlackManaSymbol } from '../../svgs/black-mana-symbol.svg';
import { ReactComponent as RedManaSymbol } from '../../svgs/red-mana-symbol.svg';
import { ReactComponent as GreenManaSymbol } from '../../svgs/green-mana-symbol.svg';

const useStyles = makeStyles({
  B: {
    color: monoColors[2].hex
  },
  colorCheckbox: {
    padding: 0,
    '& svg': {
      height: 40,
      width: 40
    }
  },
  colorCheckboxContainer: {
    textAlign: 'center'
  },
  G: {
    color: monoColors[4].hex
  },
  manaSymbol: {
    height: 40,
    width: 40
  },
  R: {
    color: monoColors[3].hex
  },
  U: {
    color: monoColors[1].hex
  },
  W: {
    color: monoColors[0].hex
  }
});

export default function ColorCheckboxes ({
  colorIdentity,
  handleColorIdentityChange
}) {

  const classes = useStyles();

  const colorObj = {
    "W": {
      "checked": colorIdentity.includes("W"),
      "icon": <WhiteManaSymbol className={classes.manaSymbol} />
    },
    "U": {
      "checked": colorIdentity.includes("U"),
      "icon": <BlueManaSymbol className={classes.manaSymbol} />
    },
    "B": {
      "checked": colorIdentity.includes("B"),
      "icon": <BlackManaSymbol className={classes.manaSymbol} />
    },
    "R": {
      "checked": colorIdentity.includes("R"),
      "icon": <RedManaSymbol className={classes.manaSymbol} />
    },
    "G": {
      "checked": colorIdentity.includes("G"),
      "icon": <GreenManaSymbol className={classes.manaSymbol} />
    }
  };

  function handleColorCheckboxClick (color) {
    const colors = [];

    for (let [key, value] of Object.entries(colorObj)) {
      if (key === color && !value.checked) colors.push(key);
      if (key !== color && value.checked) colors.push(key);
    }

    handleColorIdentityChange(colors.sort());
  }

  return (
    <MUIGrid container justify="space-around">
      {Array.from(Object.keys(colorObj)).map(color => (
        <MUIGrid className={classes.colorCheckboxContainer} item key={color} xs={4}>
          <MUICheckbox
            checked={colorObj[color].checked}
            checkedIcon={colorObj[color].icon}
            className={`${classes.colorCheckbox} ${classes[color]}`}
            onChange={() => handleColorCheckboxClick(color)}
          />
        </MUIGrid>
      ))}
    </MUIGrid>
  );
};