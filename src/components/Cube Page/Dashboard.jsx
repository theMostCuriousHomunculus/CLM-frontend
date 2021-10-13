import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIDeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIEditIcon from '@mui/icons-material/Edit';
import MUIFormControl from '@mui/material/FormControl';
import MUIIconButton from '@mui/material/IconButton';
import MUIImageList from '@mui/material/ImageList';
import MUIImageListItem from '@mui/material/ImageListItem';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISelect from '@mui/material/Select';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';

import generateCSVList from '../../functions/generate-csv-list';
import randomSampleWOReplacement from '../../functions/random-sample-wo-replacement';
import Avatar from '../miscellaneous/Avatar';
import CreateComponentForm from './CreateComponentForm';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { CubeContext } from '../../contexts/cube-context';

export default function Dashboard () {

  const { isLoggedIn, userId } = React.useContext(AuthenticationContext);
  const {
    activeComponentState,
    cubeState: {
      creator,
      description,
      mainboard,
      modules,
      name: cubeName,
      rotations,
      sideboard
    },
    cloneCube,
    deleteModule,
    deleteRotation,
    displayState,
    editCube,
    editModule,
    editRotation,
    setDisplayState
  } = React.useContext(CubeContext);
  const [componentNameInput, setComponentNameInput] = React.useState(activeComponentState.name);
  const [createComponentDialogIsOpen, setCreateComponentDialogIsOpen] = React.useState(false);
  const [cubeNameInput, setCubeNameInput] = React.useState(cubeName);
  const [descriptionInput, setDescriptionInput] = React.useState(description);
  const [editingComponentName, setEditingComponentName] = React.useState(false);
  const [samplePack, setSamplePack] = React.useState([]);
  const [samplePackDialogIsOpen, setSamplePackDialogIsOpen] = React.useState(false);
  const [sizeInput, setSizeInput] = React.useState(activeComponentState.size);
  const componentNameInputRef = React.useRef();

  React.useEffect(() => {
    setComponentNameInput(activeComponentState.name);
  }, [activeComponentState.name]);

  React.useEffect(() => {
    setCubeNameInput(cubeName);
  }, [cubeName]);

  React.useEffect(() => {
    setDescriptionInput(description);
  }, [description]);

  React.useEffect(() => {
    setSizeInput(activeComponentState.size);
  }, [activeComponentState.size]);

  return (
    <React.Fragment>
      <MUIDialog
        onClose={() => {
          setSamplePackDialogIsOpen(false);
          setSamplePack([]);
        }}
        open={samplePackDialogIsOpen}
      >
        <MUIDialogTitle>Sample Pack from {cubeName}</MUIDialogTitle>
        <MUIDialogContent>
          <MUIImageList cols={2} rowHeight={264} sx={{ width: 382 }}>
            {samplePack.map(card => (
              <MUIImageListItem key={card._id}>
                <img
                  alt={card.name}
                  src={card.image}
                  style={{ height: 264, width: 189 }}
                />
              </MUIImageListItem>
            ))}
          </MUIImageList>
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton onClick={() => setSamplePack(randomSampleWOReplacement(mainboard, 15))}>
            New Sample Pack
          </MUIButton>
        </MUIDialogActions>
      </MUIDialog>

      <CreateComponentForm
        open={createComponentDialogIsOpen}
        setComponentNameInput={setComponentNameInput}
        setSizeInput={setSizeInput}
        toggleOpen={() => setCreateComponentDialogIsOpen(prevState => !prevState)}
      />

      <MUICard>
        <MUICardHeader
          action={
            <React.Fragment>
              
              {!editingComponentName &&
                <div style={{ display: 'flex' }}>
                  {!['mainboard', 'sideboard'].includes(activeComponentState._id) &&
                    userId === creator._id &&
                    <MUIIconButton
                      aria-label="edit component name"
                      color="primary"
                      onClick={() => {
                        setEditingComponentName(true);
                        setTimeout(() => componentNameInputRef.current.focus(), 0);
                      }}
                    >
                      <MUIEditIcon />
                    </MUIIconButton>
                  }
                  
                  <MUIFormControl variant="outlined">
                    <MUIInputLabel htmlFor="component-selector">Viewing</MUIInputLabel>
                    <MUISelect
                      fullWidth
                      label="Viewing"
                      native
                      onChange={event => {
                        setDisplayState(prevState => ({
                          ...prevState,
                          activeComponentID: event.target.value
                        }));
                      }}
                      value={activeComponentState._id}
                      inputProps={{
                        id: 'component-selector'
                      }}
                    >
                      <optgroup label="">
                        <option value="mainboard">Mainboard</option>
                        <option value="sideboard">Sideboard</option>
                      </optgroup>
                      {modules.length > 0 &&
                        <optgroup label="Modules">
                          {modules.map(module => (
                            <option
                              key={module._id}
                              value={module._id}
                            >
                              {module.name}
                            </option>
                          ))}
                        </optgroup>
                      }
                      {rotations.length > 0 &&
                        <optgroup label="Rotations">
                          {rotations.map(rotation => (
                            <option
                              key={rotation._id}
                              value={rotation._id}
                            >
                              {rotation.name}
                            </option>
                          ))}
                        </optgroup>
                      }
                    </MUISelect>
                  </MUIFormControl>
                </div>
              }

              {editingComponentName &&
                <MUITextField
                  label={`${Number.isInteger(activeComponentState.size) ? 'Rotation' : 'Module'} Name`}
                  inputProps={{
                    onBlur: () => {
                      if (Number.isInteger(activeComponentState.size)) {
                        editRotation(componentNameInput, sizeInput)
                      } else {
                        editModule(componentNameInput)
                      }
                      setEditingComponentName(false);
                    }
                  }}
                  inputRef={componentNameInputRef}
                  onChange={(event) => setComponentNameInput(event.target.value)}
                  value={componentNameInput}
                />
              }

              {Number.isInteger(activeComponentState.size) &&
                <MUITextField
                  disabled={userId !== creator._id}
                  label="Rotation Size"
                  inputProps={{
                    max: activeComponentState.maxSize,
                    min: 0,
                    onBlur: () => editRotation(componentNameInput, sizeInput),
                    step: 1
                  }}
                  onChange={event => setSizeInput(event.target.value)}
                  style={{
                    marginLeft:
                      !editingComponentName &&
                      userId === creator._id &&
                      !['mainboard', 'sideboard'].includes(activeComponentState._id) ? 40 : 0,
                    marginTop: 8
                  }}
                  type="number"
                  value={sizeInput}
                />
              }
            </React.Fragment>
          }
          avatar={
            <Avatar
              alt={creator.name}
              size='large'
              src={creator.avatar}
            />
          }
          title={
            <MUITextField
              disabled={userId !== creator._id}
              inputProps={{ onBlur: () => editCube(descriptionInput, cubeNameInput) }}
              label="Cube Name"
              onChange={event => setCubeNameInput(event.target.value)}
              type="text"
              value={cubeNameInput}
            />
          }
          subheader={
            <React.Fragment>
              <MUITypography
                color="textSecondary"
                variant="subtitle1"
              >
                Designed by: <Link to={`/account/${creator._id}`}>{creator.name}</Link>
              </MUITypography>
              <MUITypography variant="subtitle1">
                <CSVLink
                  data={generateCSVList(
                    mainboard,
                    modules.map(module => module.cards).flat()
                      .concat(rotations.map(rotation => rotation.cards).flat())
                      .concat(sideboard)
                  )}
                  filename={`${cubeName}.csv`}
                  target="_blank"
                >
                  Export Cube List to CSV
                </CSVLink>
              </MUITypography>
            </React.Fragment>
          }
        />

        <MUICardContent>
          <MUITextField
            disabled={userId !== creator._id}
            fullWidth={true}
            inputProps={{ onBlur: () => editCube(descriptionInput, cubeNameInput) }}
            label="Cube Description"
            multiline
            onChange={event => setDescriptionInput(event.target.value)}
            rows={2}
            value={descriptionInput}
          />

          <MUITypography
            style={{
              lineHeight: 2,
              textAlign: 'right'
            }}
            variant="subtitle1"
          >
            Matches: <strong>{activeComponentState.displayedCards.length}</strong>
          </MUITypography>
          <MUITextField
            autoComplete="off"
            fullWidth
            label="Filter by keywords, name or type"
            onChange={event => {
              event.persist();
              setDisplayState(prevState => ({
                ...prevState,
                filter: event.target.value
              }));
            }}
            type="text"
            value={displayState.filter}
          />
        </MUICardContent>

        <MUICardActions
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          {userId === creator._id && !['mainboard', 'sideboard'].includes(activeComponentState._id) &&
            <WarningButton
              onClick={Number.isInteger(activeComponentState.size) ?
                () => deleteRotation(setComponentNameInput, setSizeInput) :
                () => deleteModule(setComponentNameInput)
              }
              startIcon={<MUIDeleteForeverIcon />}
            >
              Delete this {Number.isInteger(activeComponentState.size) ? 'Rotation' : 'Module'}
            </WarningButton>
          }

          {isLoggedIn &&
            <MUIButton onClick={cloneCube}>
              Clone This Cube
            </MUIButton>
          }

          {userId === creator._id &&
            <MUIButton onClick={() => setCreateComponentDialogIsOpen(true)}>
              Create a New Component
            </MUIButton>
          }

          <MUIButton
            onClick={() => {
              setSamplePack(randomSampleWOReplacement(mainboard, 15));
              setSamplePackDialogIsOpen(true);
            }}
          >
            See a Sample Pack
          </MUIButton>
        </MUICardActions>
      </MUICard>
    </React.Fragment>
  );
};