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
import { useParams } from 'react-router';

import useRequest from '../../hooks/request-hook';
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
  }
});

export default function ComponentInfo ({
  component,
  display,
  editable,
  modules,
  rotations,
  setDisplay
}) {

  const classes = useStyles();
  const cubeID = useParams().cubeId;
  const [componentName, setComponentName] = React.useState(component.name);
  const [componentSize, setComponentSize] = React.useState(component.size);
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const { sendRequest } = useRequest();

  async function deleteComponent () {
    if (Number.isInteger(parseInt(componentSize))) {
      await sendRequest({
        callback: () => {
          setComponentName('Mainboard');
          setComponentSize(null);
          setDisplay(prevState => ({
            ...prevState,
            activeComponentID: 'mainboard'
          }));
        },
        headers: { CubeID: cubeID },
        operation: 'deleteRotation',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(_id: "${display.activeComponentID}")
              }
            `
          }
        }
      });
    } else {
      await sendRequest({
        callback: () => {
          setComponentName('Mainboard');
          setDisplay(prevState => ({
            ...prevState,
            activeComponentID: 'mainboard'
          }));
        },
        headers: { CubeID: cubeID },
        operation: 'deleteModule',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(_id: "${display.activeComponentID}")
              }
            `
          }
        }
      });
    }
  }

  React.useEffect(() => {
    setComponentName(component.name);
  }, [component.name]);

  React.useEffect(() => {
    setComponentSize(component.size);
  }, [component.size]);

  async function submitComponentChanges () {
    if (Number.isInteger(parseInt(componentSize))) {
      await sendRequest({
        headers: { CubeID: cubeID },
        operation: 'editRotation',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  input: {
                    rotationID: "${display.activeComponentID}",
                    name: "${componentName}",
                    size: ${componentSize}
                  }
                ) {
                  _id
                }
              }
            `
          }
        }
      });
    } else {
      await sendRequest({
        headers: { CubeID: cubeID },
        operation: 'editModule',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  input: {
                    moduleID: "${display.activeComponentID}",
                    name: "${componentName}"
                  }
                ) {
                  _id
                }
              }
            `
          }
        }
      });
    }
  }

  return (
    // i'm not sure i should have the createcomponentform dialog here instead of in the cube page directly.  i am sure that i should not be using the muicard component tho; muipaper or something else would be much more appropriate
    <React.Fragment>

      <CreateComponentForm
        open={dialogIsOpen}
        setComponentName={setComponentName}
        setComponentSize={setComponentSize}
        setDisplay={setDisplay}
        toggleOpen={() => setDialogIsOpen(prevState => !prevState)}
      />
    
      <MUICard>
        <MUICardHeader
          disableTypography={true}
          title={
            <MUITextField
              autoComplete="off"
              disabled={!editable || display.activeComponentID === 'mainboard' || display.activeComponentID === 'sideboard'}
              inputProps={{
                onBlur: submitComponentChanges
              }}
              label="Active Component"
              margin="dense"
              onChange={event => setComponentName(event.target.value)}
              type="text"
              value={componentName}
              variant="outlined"
            />
          }
          action={
            <MUIFormControl variant="outlined">
              <MUIInputLabel htmlFor="component-selector">Format</MUIInputLabel>
              <MUISelect
                fullWidth
                label="Viewing"
                margin="dense"
                native
                onChange={event => {
                  setDisplay(prevState => ({
                    ...prevState,
                    activeComponentID: event.target.value
                  }));
                }}
                value={display.activeComponentID}
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
              ].map(component => (
                <option
                  key={component._id}
                  selected={display.activeComponentID === component._id}
                  value={component._id}
                >
                  {component.name}
                </option>
              ))}
                
              </MUISelect>
            </MUIFormControl>
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

          {Number.isInteger(component.size) &&
            <MUITextField
              disabled={!editable}
              label="Rotation Size"
              inputProps={{
                max: component.maxSize,
                min: 0,
                onBlur: submitComponentChanges,
                step: 1
              }}
              margin="dense"
              onChange={event => setComponentSize(event.target.value)}
              type="number"
              value={componentSize}
              variant="outlined"
            />
          }

          {editable && display.activeComponentID !== 'mainboard' && display.activeComponentID !== 'sideboard' &&
            <WarningButton onClick={deleteComponent} startIcon={<MUIDeleteForeverIcon />}>
              Delete this {Number.isInteger(component.size) ? 'Rotation' : 'Module'}
            </WarningButton>
          }
        </MUICardContent>

        <MUICardActions className={classes.cardActions}>
          <MUITypography variant="subtitle1">
            Matches: <strong>{component.displayedCards.length}</strong>
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
                filter: event.target.value
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