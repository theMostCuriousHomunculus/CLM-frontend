import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import MUIAccordion from '@mui/material/Accordion';
import MUIAccordionActions from '@mui/material/AccordionActions';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIAddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MUIButton from '@mui/material/Button';
import MUIDeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MUIExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUIIconButton from '@mui/material/IconButton';
import MUITable from '@mui/material/Table';
import MUITableBody from '@mui/material/TableBody';
import MUITableCell from '@mui/material/TableCell';
import MUITableContainer from '@mui/material/TableContainer';
import MUITableHead from '@mui/material/TableHead';
import MUITableRow from '@mui/material/TableRow';
import MUITypography from '@mui/material/Typography';

import ConfirmationDialog from '../miscellaneous/ConfirmationDialog';
import CreateCubeForm from './CreateCubeForm';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/Authentication';

export default function CubeAccordion({ pageClasses }) {
  const {
    accountState: { _id, cubes },
    deleteCube
  } = useContext(AccountContext);
  const { userID } = useContext(AuthenticationContext);
  const [cubeToDelete, setCubeToDelete] = useState({
    _id: null,
    name: null
  });
  const [showCubeForm, setShowCubeForm] = useState(false);

  return (
    <React.Fragment>
      <ConfirmationDialog
        confirmHandler={() => {
          deleteCube(cubeToDelete._id);
          setCubeToDelete({ _id: null, name: null });
        }}
        open={!!cubeToDelete._id}
        title={`Are you sure you want to delete "${cubeToDelete.name}"?`}
        toggleOpen={() => setCubeToDelete({ _id: null, name: null })}
      >
        <MUITypography variant="body1">
          This action cannot be undone. You may want to export your list first.
        </MUITypography>
      </ConfirmationDialog>

      <CreateCubeForm
        open={showCubeForm}
        toggleOpen={() => setShowCubeForm((prevState) => !prevState)}
      />

      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="cube-content"
          id="cube-header"
        >
          <MUITypography variant="h3">Cubes</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Cube</MUITableCell>
                  <MUITableCell>Description</MUITableCell>
                  {_id === userID && <MUITableCell />}
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {cubes.map((cube) => (
                  <MUITableRow key={cube._id}>
                    <MUITableCell>
                      <span
                        style={{
                          alignItems: 'center',
                          columnGap: 8,
                          display: 'flex'
                        }}
                      >
                        {cube.image && (
                          <img
                            alt={cube.image.alt}
                            height={50}
                            src={cube.image.src}
                            style={{ borderRadius: 4 }}
                          />
                        )}
                        <Link to={`/cube/${cube._id}`}>{cube.name}</Link>
                      </span>
                    </MUITableCell>

                    <MUITableCell>{cube.description}</MUITableCell>

                    {_id === userID && (
                      <MUITableCell style={{ textAlign: 'right' }}>
                        <MUIIconButton
                          color="secondary"
                          onClick={() =>
                            setCubeToDelete({ _id: cube._id, name: cube.name })
                          }
                          size="small"
                        >
                          <MUIDeleteForeverOutlinedIcon fontSize="large" />
                        </MUIIconButton>
                      </MUITableCell>
                    )}
                  </MUITableRow>
                ))}
              </MUITableBody>
            </MUITable>
          </MUITableContainer>
        </MUIAccordionDetails>

        {_id === userID && (
          <MUIAccordionActions>
            <MUIButton
              onClick={() => setShowCubeForm(true)}
              startIcon={<MUIAddCircleOutlineOutlinedIcon />}
            >
              Build
            </MUIButton>
          </MUIAccordionActions>
        )}
      </MUIAccordion>
    </React.Fragment>
  );
}
