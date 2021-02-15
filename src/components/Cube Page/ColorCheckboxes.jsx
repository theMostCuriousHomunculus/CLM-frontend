import React from 'react';
import MUICheckbox from '@material-ui/core/Checkbox';
import MUIGrid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { actionCreators } from '../../store/actions/cube-actions';
import { monoColors } from '../../constants/color-objects';
import { ReactComponent as WhiteManaSymbol } from '../../images/white-mana-symbol.svg';
import { ReactComponent as BlueManaSymbol } from '../../images/blue-mana-symbol.svg';
import { ReactComponent as BlackManaSymbol } from '../../images/black-mana-symbol.svg';
import { ReactComponent as RedManaSymbol } from '../../images/red-mana-symbol.svg';
import { ReactComponent as GreenManaSymbol } from '../../images/green-mana-symbol.svg';

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

const ColorCheckboxes = (props) => {

  const {
    card_id,
    color_identity,
    dispatchEditCard,
    submitCardChange
  } = props;
  const classes = useStyles();

  const colorObj = {
    "W": {
      "icon": <WhiteManaSymbol className={classes.manaSymbol} />,
      "checked": color_identity.includes("W")
    },
    "U": {
      "icon": <BlueManaSymbol className={classes.manaSymbol} />,
      "checked": color_identity.includes("U")
    },
    "B": {
      "icon": <BlackManaSymbol className={classes.manaSymbol} />,
      "checked": color_identity.includes("B")
    },
    "R": {
      "icon": <RedManaSymbol className={classes.manaSymbol} />,
      "checked": color_identity.includes("R")
    },
    "G": {
      "icon": <GreenManaSymbol className={classes.manaSymbol} />,
      "checked": color_identity.includes("G")
    }
  };

  function submitColorIdentityChange (color) {
    let color_identity = [];

    for (let [key, value] of Object.entries(colorObj)) {
      if (key === color && !value.checked) color_identity.push(key);
      if (key !== color && value.checked) color_identity.push(key);
    }

    dispatchEditCard({ cardId: card_id, color_identity: color_identity.sort() })
    submitCardChange(card_id, { color_identity: color_identity.sort() });
  }
  
  return (
    <MUIGrid container justify="space-around">
      {Array.from(Object.keys(colorObj)).map(function (color) {
        return (
          <MUIGrid className={classes.colorCheckboxContainer} item key={`${color}-${card_id}`} xs={4}>
            <MUICheckbox
              checked={colorObj[color]['checked']}
              checkedIcon={colorObj[color]['icon']}
              className={`${classes.colorCheckbox} ${classes[color]}`}
              color="primary"
              onChange={() => submitColorIdentityChange(color)}
            />
          </MUIGrid>
        );
      })}
    </MUIGrid>
  );
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchEditCard: (payload) => dispatch(actionCreators.edit_card(payload))
  };
}

export default connect(null, mapDispatchToProps)(ColorCheckboxes);