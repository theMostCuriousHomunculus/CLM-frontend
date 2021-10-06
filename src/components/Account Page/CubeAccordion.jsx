import React from 'react';
import { Link } from 'react-router-dom';
import MUIAccordion from '@mui/material/Accordion';
import MUIAccordionActions from '@mui/material/AccordionActions';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIButton from '@mui/material/Button';
import MUIDeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
import { AuthenticationContext } from '../../contexts/authentication-context';

export default function CubeAccordion ({
  pageClasses
}) {

  const { accountState: { _id, cubes }, deleteCube } = React.useContext(AccountContext);
  const { userId } = React.useContext(AuthenticationContext);
  const [cubeToDelete, setCubeToDelete] = React.useState({ _id: null, name: null })
  const [showCubeForm, setShowCubeForm] = React.useState(false);

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
          This action cannot be undone.  You may want to export your list first.
        </MUITypography>
      </ConfirmationDialog>

      <CreateCubeForm
        open={showCubeForm}
        toggleOpen={() => setShowCubeForm(prevState => !prevState)}
      />

      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="cube-content"
          id="cube-header"
        >
          <MUITypography>Cubes ({cubes.length})</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Name</MUITableCell>
                  <MUITableCell>Description</MUITableCell>
                  {_id === userId &&
                    <MUITableCell>Delete</MUITableCell>
                  }
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {cubes.map(cube => (
                  <MUITableRow key={cube._id}>
                    <MUITableCell>
                      <Link to={`/cube/${cube._id}`}>{cube.name}</Link>
                    </MUITableCell>
                    <MUITableCell>
                      {cube.description}
                    </MUITableCell>
                    {_id === userId &&
                      <MUITableCell>
                        <MUIIconButton
                          className={pageClasses.iconButton}
                          onClick={() => setCubeToDelete({ _id: cube._id, name: cube.name })}
                          size="small"
                        >
                          <MUIDeleteForeverIcon />
                        </MUIIconButton>
                      </MUITableCell>
                    }
                  </MUITableRow>
                ))}
              </MUITableBody>
            </MUITable>
          </MUITableContainer>
        </MUIAccordionDetails>

        {_id === userId &&
          <MUIAccordionActions>
            <MUIButton onClick={() => setShowCubeForm(true)}>
              Create a Cube
            </MUIButton>
          </MUIAccordionActions>
        }

      </MUIAccordion>

    </React.Fragment>
  );
};