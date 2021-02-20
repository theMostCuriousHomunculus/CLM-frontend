import React from 'react';
import { Link, useParams } from 'react-router-dom';
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
import ErrorDialog from '../miscellaneous/ErrorDialog';
import theme, { backgroundColor } from '../../theme';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { deleteCube as deleteCubeRequest } from '../../requests/cube-requests';

const useStyles = makeStyles({
  iconButton: {
    background: theme.palette.secondary.main,
    color: backgroundColor,
    '&:hover': {
      background: theme.palette.secondary.dark,
      // padding: 18
    }
  }
});

const UserCubeCard = (props) => {

  const { cubes, pageClasses, updateCubeList } = props;

  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [dialogInfo, setDialogInfo] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState();
  const [showCubeForm, setShowCubeForm] = React.useState(false);

  async function deleteCube (cubeId) {
    try {
      await deleteCubeRequest(cubeId, authentication.token);
      updateCubeList(cubeId);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <React.Fragment>

      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <ConfirmationDialogue
        confirmHandler={deleteCube}
        dialogInfo={dialogInfo}
        toggleOpen={() => setDialogInfo({})}
      />

      <CreateCubeForm
        open={showCubeForm}
        toggleOpen={() => setShowCubeForm(prevState => !prevState)}
      />

      <MUICard>
        <MUICardHeader
          disableTypography={true}
          title={<MUITypography variant="h5">Cubes</MUITypography>}
        />
        <MUICardContent>
          <MUITableContainer className={pageClasses.tableContainer}>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Name</MUITableCell>
                  <MUITableCell>Description</MUITableCell>
                  {accountId === authentication.userId &&
                    <MUITableCell>Delete</MUITableCell>
                  }
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {cubes.map(function (cube) {
                  return (
                    <MUITableRow key={cube._id}>
                      <MUITableCell>
                        <Link to={`/cube/${cube._id}`}>{cube.name}</Link>
                      </MUITableCell>
                      <MUITableCell>
                        {cube.description}
                      </MUITableCell>
                      {accountId === authentication.userId &&
                        <MUITableCell>
                          <MUIIconButton
                            className={classes.iconButton}
                            // color="secondary"
                            onClick={() => setDialogInfo({
                              data: cube._id,
                              content: <MUITypography variant="body1">
                                This action cannot be undone.  You may want to export your list first.
                              </MUITypography>,
                              title: `Are you sure you want to delete "${cube.name}?`
                            })}
                            size="small"
                          >
                            <MUIDeleteForeverIcon />
                          </MUIIconButton>
                        </MUITableCell>
                      }
                    </MUITableRow>
                  );
                })}
              </MUITableBody>
            </MUITable>
          </MUITableContainer>
        </MUICardContent>
        {accountId === authentication.userId &&
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

export default UserCubeCard;