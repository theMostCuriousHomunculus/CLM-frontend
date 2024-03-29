import React, { useContext, useEffect, useState, useRef } from 'react';
import MUIAddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUICheckbox from '@mui/material/Checkbox';
import MUIDeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIEditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MUIFileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIHelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MUIIconButton from '@mui/material/IconButton';
import MUIImageList from '@mui/material/ImageList';
import MUIImageListItem from '@mui/material/ImageListItem';
import MUIInputAdornment from '@mui/material/InputAdornment';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISelect from '@mui/material/Select';
import MUIShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined';
import MUITextField from '@mui/material/TextField';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';

import CreateComponentForm from './CreateComponentForm';
import DeleteCubeForm from '../../forms/DeleteCubeForm';
import ScryfallRequest from '../miscellaneous/ScryfallRequest';
import generateCSVList from '../../functions/generate-csv-list';
import randomSampleWOReplacement from '../../functions/random-sample-wo-replacement';
import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/Authentication';
import { CubeContext } from '../../contexts/cube-context';

export default function CubeDashboard() {
  const { isLoggedIn, userID } = useContext(AuthenticationContext);
  const {
    activeComponentState,
    cubeState: {
      _id: cubeID,
      creator,
      description,
      image,
      mainboard,
      modules,
      name: cubeName,
      published,
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
  } = useContext(CubeContext);
  const [createComponentDialogIsOpen, setCreateComponentDialogIsOpen] =
    useState(false);
  const [cubeNameInput, setCubeNameInput] = useState(cubeName);
  const [cubeToDelete, setCubeToDelete] = useState({ _id: null, name: null });
  const [descriptionInput, setDescriptionInput] = useState(description);
  const [editingComponentName, setEditingComponentName] = useState(false);
  const [isPublished, setIsPublished] = useState(published);
  const [samplePack, setSamplePack] = useState([]);
  const [sizeInput, setSizeInput] = useState(activeComponentState.size);
  const componentNameInputRef = useRef();
  const cubeImageWidth = useMediaQuery(theme.breakpoints.up('md')) ? 150 : 75;

  useEffect(() => {
    setCubeNameInput(cubeName);
  }, [cubeName]);

  useEffect(() => {
    setDescriptionInput(description);
  }, [description]);

  useEffect(() => {
    setIsPublished(published);
  }, [published]);

  useEffect(() => {
    setSizeInput(activeComponentState.size);
  }, [activeComponentState.size]);

  return (
    <React.Fragment>
      <MUIDialog onClose={() => setSamplePack([])} open={samplePack.length > 0}>
        <MUIDialogTitle>Sample Pack from {cubeName}</MUIDialogTitle>
        <MUIDialogContent>
          <MUIImageList cols={2} rowHeight={264} sx={{ width: 382 }}>
            {samplePack.map((card) => (
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
          <MUIButton
            onClick={() =>
              setSamplePack(randomSampleWOReplacement(mainboard, 15))
            }
          >
            New Sample Pack
          </MUIButton>
        </MUIDialogActions>
      </MUIDialog>

      <CreateComponentForm
        open={createComponentDialogIsOpen}
        toggleOpen={() =>
          setCreateComponentDialogIsOpen((prevState) => !prevState)
        }
      />

      <DeleteCubeForm
        setCubeToDelete={setCubeToDelete}
        cubeToDelete={cubeToDelete}
      />

      <MUICard>
        <MUICardHeader
          action={
            <React.Fragment>
              {!editingComponentName && (
                <div style={{ display: 'flex' }}>
                  {!['mainboard', 'sideboard'].includes(
                    activeComponentState._id
                  ) &&
                    userID === creator._id && (
                      <MUIIconButton
                        aria-label="edit component name"
                        color="primary"
                        onClick={() => {
                          setEditingComponentName(true);
                          setTimeout(
                            () => componentNameInputRef.current.focus(),
                            0
                          );
                        }}
                      >
                        <MUIEditOutlinedIcon />
                      </MUIIconButton>
                    )}

                  <MUIFormControl variant="outlined">
                    <MUIInputLabel htmlFor="component-selector">
                      Viewing
                    </MUIInputLabel>
                    <MUISelect
                      inputProps={{ id: 'component-selector' }}
                      label="Viewing"
                      native
                      onChange={(event) => {
                        setDisplayState((prevState) => ({
                          ...prevState,
                          activeComponentID: event.target.value
                        }));
                      }}
                      value={activeComponentState._id}
                    >
                      <optgroup label="Built-In">
                        <option value="mainboard">Mainboard</option>
                        <option value="sideboard">Sideboard</option>
                      </optgroup>
                      {modules.length > 0 && (
                        <optgroup label="Modules">
                          {modules.map((module) => (
                            <option key={module._id} value={module._id}>
                              {module.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {rotations.length > 0 && (
                        <optgroup label="Rotations">
                          {rotations.map((rotation) => (
                            <option key={rotation._id} value={rotation._id}>
                              {rotation.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </MUISelect>
                  </MUIFormControl>
                </div>
              )}

              {editingComponentName && (
                <MUITextField
                  defaultValue={activeComponentState.name}
                  label={`${
                    Number.isInteger(activeComponentState.size)
                      ? 'Rotation'
                      : 'Module'
                  } Name`}
                  inputProps={{
                    onBlur: () => {
                      if (
                        activeComponentState.name !==
                        componentNameInputRef.current.value
                      ) {
                        if (Number.isInteger(activeComponentState.size)) {
                          editRotation(
                            componentNameInputRef.current.value,
                            sizeInput
                          );
                        } else {
                          editModule(componentNameInputRef.current.value);
                        }
                      }
                      setEditingComponentName(false);
                    }
                  }}
                  inputRef={componentNameInputRef}
                />
              )}

              {Number.isInteger(activeComponentState.size) && (
                <MUITextField
                  disabled={userID !== creator._id}
                  label="Rotation Size"
                  inputProps={{
                    max: activeComponentState.maxSize,
                    min: 0,
                    onBlur: () =>
                      editRotation(activeComponentState.name, sizeInput),
                    step: 1
                  }}
                  onChange={(event) => setSizeInput(event.target.value)}
                  style={{
                    marginLeft:
                      !editingComponentName &&
                      userID === creator._id &&
                      !['mainboard', 'sideboard'].includes(
                        activeComponentState._id
                      )
                        ? 40
                        : 0,
                    marginTop: 8
                  }}
                  type="number"
                  value={sizeInput}
                />
              )}
            </React.Fragment>
          }
          avatar={
            image && (
              <img
                alt={image.alt}
                src={image.src}
                style={{ borderRadius: 4 }}
                width={cubeImageWidth}
              />
            )
          }
          title={
            <React.Fragment>
              <MUITextField
                disabled={userID !== creator._id}
                inputProps={{
                  onBlur: () => {
                    editCube(
                      descriptionInput,
                      image.scryfall_id,
                      cubeNameInput,
                      isPublished
                    );
                  }
                }}
                label="Cube Name"
                onChange={(event) => setCubeNameInput(event.target.value)}
                type="text"
                value={cubeNameInput}
              />
              {creator._id === userID && (
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <MUIFormControlLabel
                    control={
                      <MUICheckbox
                        checked={isPublished}
                        onChange={() => {
                          editCube(
                            descriptionInput,
                            image.scryfall_id,
                            cubeNameInput,
                            !isPublished
                          );
                          setIsPublished((prevState) => !prevState);
                        }}
                      />
                    }
                    label="Published"
                    style={{ marginRight: 8 }}
                  />
                  <MUITooltip title="A published cube is visible to other users.">
                    <MUIHelpOutlineIcon color="primary" />
                  </MUITooltip>
                </div>
              )}
            </React.Fragment>
          }
          subheader={
            <React.Fragment>
              <MUITypography color="textSecondary" variant="subtitle1">
                Designed by:{' '}
                <Link to={`/account/${creator._id}`}>{creator.name}</Link>
              </MUITypography>
              <MUITypography variant="subtitle1">
                <CSVLink
                  data={generateCSVList(
                    mainboard,
                    modules
                      .map((module) => module.cards)
                      .flat()
                      .concat(
                        rotations.map((rotation) => rotation.cards).flat()
                      )
                      .concat(sideboard)
                  )}
                  filename={`${cubeName}.csv`}
                  target="_blank"
                >
                  Export to CSV
                </CSVLink>
              </MUITypography>
            </React.Fragment>
          }
        />

        <MUICardContent>
          <MUITextField
            disabled={userID !== creator._id}
            fullWidth={true}
            inputProps={{
              onBlur: () => {
                editCube(
                  descriptionInput,
                  image.scryfall_id,
                  cubeNameInput,
                  isPublished
                );
              }
            }}
            label="Cube Description"
            multiline
            onChange={(event) => setDescriptionInput(event.target.value)}
            rows={2}
            style={{ marginBottom: 8 }}
            value={descriptionInput}
          />

          {userID === creator._id && (
            <ScryfallRequest
              buttonText="Change Image"
              labelText="Cube Image"
              onSubmit={(chosenCard) => {
                editCube(
                  descriptionInput,
                  chosenCard.scryfall_id,
                  cubeNameInput,
                  isPublished
                );
              }}
            />
          )}

          <MUITextField
            autoComplete="off"
            fullWidth
            InputProps={{
              endAdornment: (
                <MUIInputAdornment position="end">
                  <span>
                    Matches:{' '}
                    <strong>
                      {activeComponentState.displayedCards.length}
                    </strong>
                  </span>
                </MUIInputAdornment>
              )
            }}
            label="Filter by keywords, name or type"
            margin="normal"
            onChange={(event) => {
              event.persist();
              setDisplayState((prevState) => ({
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
          {userID === creator._id && (
            <React.Fragment>
              <span style={{ flexGrow: 1 }}>
                <MUIButton
                  color="warning"
                  onClick={() => {
                    setCubeToDelete({ _id: cubeID, name: cubeName });
                  }}
                  startIcon={<MUIDeleteForeverOutlinedIcon />}
                >
                  Delete Cube
                </MUIButton>
              </span>

              {!['mainboard', 'sideboard'].includes(
                activeComponentState._id
              ) && (
                <MUIButton
                  color="warning"
                  onClick={
                    Number.isInteger(activeComponentState.size)
                      ? deleteRotation
                      : deleteModule
                  }
                  startIcon={<MUIDeleteForeverOutlinedIcon />}
                >
                  Delete this{' '}
                  {Number.isInteger(activeComponentState.size)
                    ? 'Rotation'
                    : 'Module'}
                </MUIButton>
              )}
            </React.Fragment>
          )}

          {isLoggedIn && (
            <MUIButton
              onClick={cloneCube}
              startIcon={<MUIFileCopyOutlinedIcon />}
            >
              Clone Cube
            </MUIButton>
          )}

          {userID === creator._id && (
            <MUIButton
              onClick={() => setCreateComponentDialogIsOpen(true)}
              startIcon={<MUIAddCircleOutlineOutlinedIcon />}
            >
              New Component
            </MUIButton>
          )}

          <MUIButton
            onClick={() =>
              setSamplePack(randomSampleWOReplacement(mainboard, 15))
            }
            startIcon={<MUIShuffleOutlinedIcon />}
          >
            Sample Pack
          </MUIButton>
        </MUICardActions>
      </MUICard>
    </React.Fragment>
  );
}
