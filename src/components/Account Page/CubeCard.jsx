import React from 'react';
import { Link } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIIconButton from '@material-ui/core/IconButton';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ConfirmationDialogue from '../miscellaneous/ConfirmationDialog';
import CreateCubeForm from './CreateCubeForm';
import theme, { backgroundColor } from '../../theme';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/authentication-context';

const useStyles = makeStyles({
  iconButton: {
    background: theme.palette.secondary.main,
    color: backgroundColor,
    '&:hover': {
      background: theme.palette.secondary.dark
    }
  }
});

export default function CubeCard ({
  pageClasses
}) {

  const { accountState: { _id, cubes }, deleteCube } = React.useContext(AccountContext);
  const { userId } = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [cubeToDelete, setCubeToDelete] = React.useState({ _id: null, name: null })
  const [showCubeForm, setShowCubeForm] = React.useState(false);

  return (
    <React.Fragment>

      <ConfirmationDialogue
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
      </ConfirmationDialogue>

      <CreateCubeForm
        open={showCubeForm}
        toggleOpen={() => setShowCubeForm(prevState => !prevState)}
      />

      <MUICard>
        <MUICardHeader title="Cubes" />
        <MUICardContent>
          <MUITableContainer className={pageClasses.tableContainer}>
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
                          className={classes.iconButton}
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
        </MUICardContent>
        {_id === userId &&
          <MUICardActions>
            <MUIButton
              color="primary"
              onClick={() => setShowCubeForm(true)}
              size="small"
              variant="contained"
            >
              Create a Cube
            </MUIButton>
          </MUICardActions>
        }
      </MUICard>
    </React.Fragment>
  );
};