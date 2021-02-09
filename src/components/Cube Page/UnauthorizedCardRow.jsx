import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { monoColors, multiColors } from '../../constants/color-objects';
import { ReactComponent as TCGPlayerLogo } from '../../images/tcgplayer-logo-full-color.svg';

const useStyles = makeStyles({
  tableCell: {
    alignItems: "center",
    display: "flex",
    padding: "0 8px"
  }
});

const UnauthorizedCardRow = (props) => {

  const {
    card: {
      back_image,
      cmc,
      color_identity,
      image,
      name,
      printing,
      purchase_link,
      type_line
    },
    columnWidths,
    hidePreview,
    showPreview
  } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <div
        back_image={back_image}
        className={classes.tableCell}
        image={image}
        onMouseOut={hidePreview}
        onMouseOver={showPreview}
        style={{ cursor: "default", width: columnWidths[0] }}
      >
        {name}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[1] }}>
        {[...monoColors, ...multiColors].find(function(color) {
          return color.color_identity === color_identity.toString();
        }).name}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[2] }}>
        {cmc}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[3] }}>
        {type_line}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[4] }}>
        {printing}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[5] }}>
        <a href={purchase_link}>
          <TCGPlayerLogo style={{ width: "75%" }} />
        </a>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps (state, ownProps) {
  return {
    activeComponentId: state.active_component_id,
    activeComponentName: state.active_component_name,
    card: state.displayed_cards[ownProps.index],
    modules: state.cube.modules.map(module => ({ _id: module._id, name: module.name})),
    rotations: state.cube.rotations.map(rotation => ({ _id: rotation._id, name: rotation.name }))
  };
}

export default connect(mapStateToProps)(UnauthorizedCardRow);