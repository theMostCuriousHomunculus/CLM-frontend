import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIInputLabel from '@material-ui/core/InputLabel';
import MUISelect from '@material-ui/core/Select';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CreateComponentForm from './CreateComponentForm';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { CubeContext } from '../../contexts/cube-context';

const useStyles = makeStyles({
  cardActions: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

export default function ComponentInfo ({
  modules,
  rotations
}) {

  const classes = useStyles();
  const { userId } = React.useContext(AuthenticationContext);
  const {
    activeComponentState,
    cubeState: { creator },
    displayState,
    setDisplayState,
    deleteModule,
    deleteRotation,
    editModule,
    editRotation
  } = React.useContext(CubeContext);
  const [nameInput, setNameInput] = React.useState(activeComponentState.name);
  const [sizeInput, setSizeInput] = React.useState(activeComponentState.size);
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);

  React.useEffect(() => {
    setNameInput(activeComponentState.name);
  }, [activeComponentState.name]);

  React.useEffect(() => {
    setSizeInput(activeComponentState.size);
  }, [activeComponentState.size]);

  return (
    // i'm not sure i should have the createcomponentform dialog here instead of in the cube page directly.  i am sure that i should not be using the muicard component tho; muipaper or something else would be much more appropriate
    <React.Fragment>

      <CreateComponentForm
        open={dialogIsOpen}
        setNameInput={setNameInput}
        setSizeInput={setSizeInput}
        toggleOpen={() => setDialogIsOpen(prevState => !prevState)}
      />
    
      <MUICard>
        <MUICardHeader
          disableTypography={true}
          title={
            <MUITextField
              autoComplete="off"
              disabled={userId !== creator._id || ['mainboard', 'sideboard'].includes(activeComponentState._id)}
              inputProps={{
                onBlur: Number.isInteger(activeComponentState.size) ?
                  () => editRotation(nameInput, sizeInput) :
                  () => editModule(nameInput)
              }}
              label="Active Component"
              margin="dense"
              onChange={event => setNameInput(event.target.value)}
              type="text"
              value={nameInput}
              variant="outlined"
            />
          }
          action={
            <MUIFormControl variant="outlined">
              <MUIInputLabel htmlFor="component-selector">Viewing</MUIInputLabel>
              <MUISelect
                fullWidth
                label="Viewing"
                margin="dense"
                native
                onChange={event => {
                  setDisplayState(prevState => ({
                    ...prevState,
                    activeComponentID: event.target.value
                  }));
                }}
                value={activeComponentState._id}
                variant="outlined"
                inputProps={{
                  id: 'component-selector'
                }}
              >
              {[
                { _id: 'mainboard', name: 'Mainboard' },
                { _id: 'sideboard', name: 'Sideboard' },
                ...modules,
                ...rotations
              ].map(cmpnt => (
                <option
                  key={cmpnt._id}
                  value={cmpnt._id}
                >
                  {cmpnt.name}
                </option>
              ))}
                
              </MUISelect>
            </MUIFormControl>
          }
        />

        <MUICardContent className={classes.cardContent}>
          {userId === creator._id &&
            <MUIButton
              color="primary"
              onClick={() => setDialogIsOpen(true)}
              size="small"
              variant="contained"
            >
              Create a New Component
            </MUIButton>
          }

          {Number.isInteger(activeComponentState.size) &&
            <MUITextField
              disabled={userId !== creator._id}
              label="Rotation Size"
              inputProps={{
                max: activeComponentState.maxSize,
                min: 0,
                onBlur: editRotation(nameInput, sizeInput),
                step: 1
              }}
              margin="dense"
              onChange={event => setSizeInput(event.target.value)}
              type="number"
              value={sizeInput}
              variant="outlined"
            />
          }

          {userId === creator._id && !['mainboard', 'sideboard'].includes(activeComponentState._id) &&
            <WarningButton
              onClick={Number.isInteger(activeComponentState.size) ?
                () => deleteRotation(setNameInput, setSizeInput) :
                () => deleteModule(setNameInput)
              }
              startIcon={<MUIDeleteForeverIcon />}
            >
              Delete this {Number.isInteger(activeComponentState.size) ? 'Rotation' : 'Module'}
            </WarningButton>
          }
        </MUICardContent>

        <MUICardActions className={classes.cardActions}>
          <MUITypography variant="subtitle1">
            Matches: <strong>{activeComponentState.displayedCards.length}</strong>
          </MUITypography>
          <MUITextField
            autoComplete="off"
            fullWidth
            label="Filter by keywords, name or type"
            margin="dense"
            onChange={event => {
              event.persist();
              setDisplayState(prevState => ({
                ...prevState,
                filter: event.target.value
              }));
            }}
            type="text"
            value={displayState.filter}
            variant="outlined"
          />
        </MUICardActions>
      </MUICard>
    
    </React.Fragment>
  );
};