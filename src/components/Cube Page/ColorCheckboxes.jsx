import React from 'react';
import MUICheckbox from '@mui/material/Checkbox';
import { makeStyles } from '@mui/styles';

import { monoColors } from '../../constants/color-objects';
import { ReactComponent as WManaSymbol } from '../../svgs/W-mana-symbol.svg';
import { ReactComponent as UManaSymbol } from '../../svgs/U-mana-symbol.svg';
import { ReactComponent as BManaSymbol } from '../../svgs/B-mana-symbol.svg';
import { ReactComponent as RManaSymbol } from '../../svgs/R-mana-symbol.svg';
import { ReactComponent as GManaSymbol } from '../../svgs/G-mana-symbol.svg';

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
      "icon": <WManaSymbol className={classes.manaSymbol} />
    },
    "U": {
      "checked": colorIdentity.includes("U"),
      "icon": <UManaSymbol className={classes.manaSymbol} />
    },
    "B": {
      "checked": colorIdentity.includes("B"),
      "icon": <BManaSymbol className={classes.manaSymbol} />
    },
    "R": {
      "checked": colorIdentity.includes("R"),
      "icon": <RManaSymbol className={classes.manaSymbol} />
    },
    "G": {
      "checked": colorIdentity.includes("G"),
      "icon": <GManaSymbol className={classes.manaSymbol} />
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
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {Array.from(Object.keys(colorObj)).map(color => (
        <MUICheckbox
          key={color}
          checked={colorObj[color].checked}
          checkedIcon={colorObj[color].icon}
          className={`${classes.colorCheckbox} ${classes[color]}`}
          onChange={() => handleColorCheckboxClick(color)}
        />
      ))}
    </div>
  );
};