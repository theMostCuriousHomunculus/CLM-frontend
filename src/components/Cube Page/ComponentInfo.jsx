import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { useParams } from 'react-router-dom';

import CreateComponentForm from './CreateComponentForm';
import WarningButton from '../miscellaneous/WarningButton';

const useStyles = makeStyles({
  cardActions: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardHeader: {
    justifyContent: 'space-between',
    '& .MuiCardHeader-content': {
      width: 'unset'
    },
    '& .MuiCardHeader-action': {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 2,
      justifyContent: 'space-between',
      margin: 0
    }
  },
  list: {
    padding: 0
  },
  listContainer: {
    flexGrow: 1
  },
  rotationSizeField: {
    margin: '0 8px 0 8px',
    width: '33%'
  }
});

export default function ComponentInfo ({
  display,
  editable,
  mainboard,
  modules,
  rotations,
  setDisplay,
  sideboard
}) {

  const classes = useStyles();
  const [componentAnchorEl, setComponentAnchorEl] = React.useState(null);
  const componentNameRef = React.useRef();
  // const cubeID = useParams().cubeId;
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const rotationSizeRef = React.useRef();
  const [viewAnchorEl, setViewAnchorEl] = React.useState(null);

  async function deleteComponent () {

  }

  const filterCards = React.useCallback((cards, text) => cards.filter(card => {
    const wordArray = text.split(" ");
    return (
      wordArray.every(word => (
        card.keywords.map(keyword => keyword.toLowerCase()).includes(word.toLowerCase()) ||
        card.name.toLowerCase().includes(word.toLowerCase()) ||
        card.type_line.toLowerCase().includes(word.toLowerCase())
      ))
    );
  }), []);

  const handleComponentMenuItemClick = (componentID, type) => {
    let activeComponentID, activeComponentCards, activeComponentName, activeComponentSize;
    
    if (componentID === 'sideboard') {
      activeComponentID = 'sideboard';
      activeComponentCards = [...sideboard];
      activeComponentName = 'Sideboard';
      activeComponentSize = null;
    } else if (type === 'module') {
      const component = modules.find(module => module._id === componentID);
      activeComponentID = component._id;
      activeComponentCards = [...component.cards];
      activeComponentName = component.name;
      activeComponentSize = null;
    } else if (type === 'rotation') {
      const component = rotations.find(rotation => rotation._id === componentID);
      activeComponentID = component._id;
      activeComponentCards = [...component.cards];
      activeComponentName = component.name;
      activeComponentSize = component.size;
    } else {
      activeComponentID = 'mainboard';
      activeComponentCards = [...mainboard];
      activeComponentName = 'Mainboard';
      activeComponentSize = null;
    }

    const filteredCards = filterCards(activeComponentCards, display.filter);

    setDisplay(prevState => ({
      ...prevState,
      activeComponentID,
      activeComponentCards,
      activeComponentName,
      activeComponentSize,
      filteredCards
    }));
    setComponentAnchorEl(null);
  };

  async function submitComponentChanges () {

  }

  return (
    <React.Fragment>

      <CreateComponentForm
        open={dialogIsOpen}
        toggleOpen={() => setDialogIsOpen(prevState => !prevState)}
      />
    
      <MUICard>
        <MUICardHeader
          className={classes.cardHeader}
          disableTypography={true}
          title={(editable &&
            display.activeComponentID !== 'mainboard' &&
            display.activeComponentID !== 'sideboard') ?
            <MUITextField
              autoComplete="off"
              inputProps={{
                defaultValue: display.activeComponentName,
                onBlur: submitComponentChanges
              }}
              inputRef={componentNameRef}
              label="Active Component"
              margin="dense"
              type="text"
              variant="outlined"
            /> :
            <MUITypography variant="subtitle1">{display.activeComponentName}</MUITypography>
          }
          action={
            <React.Fragment>
              <div className={classes.listContainer}>
                <MUIList className={classes.list} component="nav">
                  <MUIListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    onClick={(event) => setComponentAnchorEl(event.currentTarget)}
                  >
                    <MUIListItemText
                      primary="Viewing"
                      secondary={display.activeComponentName}
                    />
                  </MUIListItem>
                </MUIList>
                <MUIMenu
                  id="component-selector"
                  anchorEl={componentAnchorEl}
                  keepMounted
                  open={Boolean(componentAnchorEl)}
                  onClose={() => setComponentAnchorEl(null)}
                >
                  {[
                    { _id: 'mainboard', name: 'Mainboard' },
                    { _id: 'sideboard', name: 'Sideboard' },
                    ...modules.map(module => ({ _id: module._id, name: module.name, type: 'module' })),
                    ...rotations.map(rotation => ({ _id: rotation._id, name: rotation.name, type: 'rotation' }))
                  ].map(component => (
                    <MUIMenuItem
                      key={component._id}
                      onClick={() => handleComponentMenuItemClick(component._id, component.type)}
                      selected={display.activeComponentID === component._id}
                    >
                      {component.name}
                    </MUIMenuItem>
                  ))}
                </MUIMenu>
              </div>
              <div className={classes.listContainer}>
                <MUIList className={classes.list} component="nav">
                  <MUIListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    onClick={(event) => setViewAnchorEl(event.currentTarget)}
                  >
                    <MUIListItemText
                      primary="Display"
                      secondary={display.view}
                    />
                  </MUIListItem>
                </MUIList>
                <MUIMenu
                  id="view-selector"
                  anchorEl={viewAnchorEl}
                  keepMounted
                  open={Boolean(viewAnchorEl)}
                  onClose={() => setViewAnchorEl(null)}
                >
                  {["Curve", "List", "Table"].map(option => (
                    <MUIMenuItem
                      key={option}
                      onClick={() => {
                        setDisplay(prevState => ({
                          ...prevState,
                          view: option
                        }));
                        setViewAnchorEl(null);
                      }}
                      selected={option === display.view}
                    >
                      {option}
                    </MUIMenuItem>
                  ))}
                </MUIMenu>
              </div>
            </React.Fragment>
          }
        />

        <MUICardContent className={classes.cardContent}>
          {editable &&
            <MUIButton
              color="primary"
              onClick={() => setDialogIsOpen(true)}
              size="small"
              variant="contained"
            >
              Create a New Component
            </MUIButton>
          }

          {editable && Number.isInteger(display.activeComponentSize) &&
            <MUITextField
              className={classes.rotationSizeField}
              label="Size"
              inputProps={{
                defaultValue: display.activeRotationSize,
                max: display.activeComponentCards.length,
                min: 0,
                onBlur: submitComponentChanges,
                step: 1
              }}
              inputRef={rotationSizeRef}
              margin="dense"
              type="number"
              variant="outlined"
            />
          }

          {editable && Number.isInteger(display.activeComponentSize) &&
            <MUITypography variant="subtitle1">Rotation Size: {display.activeComponentSize}</MUITypography>
          }

          {editable && display.activeComponentID !== 'mainboard' && display.activeComponentID !== 'sideboard' &&
            <WarningButton onClick={deleteComponent} startIcon={<MUIDeleteForeverIcon />}>
              Delete this {Number.isInteger(display.activeComponentSize) ? 'Rotation' : 'Module'}
            </WarningButton>
          }
        </MUICardContent>

        <MUICardActions className={classes.cardActions}>
          <MUITypography variant="subtitle1">
            Matches: <strong>{display.filteredCards.length}</strong>
          </MUITypography>
          <MUITextField
            autoComplete="off"
            fullWidth
            label="Filter by keywords, name or type"
            margin="dense"
            onChange={event => {
              event.persist();
              setDisplay(prevState => ({
                ...prevState,
                filter: event.target.value,
                filteredCards: filterCards(prevState.activeComponentCards, event.target.value)
              }));
            }}
            type="text"
            value={display.filter}
            variant="outlined"
          />
        </MUICardActions>
      </MUICard>
    
    </React.Fragment>
  );
};