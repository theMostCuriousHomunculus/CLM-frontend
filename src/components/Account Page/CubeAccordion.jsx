import React from 'react';
import { Link } from 'react-router-dom';
import MUIAccordion from '@material-ui/core/Accordion';
import MUIAccordionActions from '@material-ui/core/AccordionActions';
import MUIAccordionDetails from '@material-ui/core/AccordionDetails';
import MUIAccordionSummary from '@material-ui/core/AccordionSummary';
import MUIButton from '@material-ui/core/Button';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MUIIconButton from '@material-ui/core/IconButton';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITypography from '@material-ui/core/Typography';

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
            <MUIButton
              color="primary"
              onClick={() => setShowCubeForm(true)}
              size="small"
              variant="contained"
            >
              Create a Cube
            </MUIButton>
          </MUIAccordionActions>
        }

      </MUIAccordion>

    </React.Fragment>
  );
};