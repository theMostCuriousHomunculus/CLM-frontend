import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';

import { AuthenticationContext } from '../../contexts/authentication-context';
import { useRequest } from '../../hooks/request-hook';

const UserCubeCard = (props) => {

  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);
  const history = useHistory();
  const { sendRequest } = useRequest();

  const [showCubeForm, setShowCubeForm] = React.useState(false);

  async function submitCubeForm () {
    let formInputs = {};
    formInputs.name = document.getElementById('cube-name').value;
    formInputs.description = document.getElementById('cube-description').value ?
      document.getElementById('cube-description').value :
      undefined;

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube`,
        'POST',
        JSON.stringify(formInputs),
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      history.push(`/cube/${responseData._id}`);
    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  return (
    <MUICard>
      <MUICardHeader title={<MUITypography variant="h3">Cubes</MUITypography>} />
      <MUICardContent>
        <MUITableContainer className={props.classes.tableContainer}>
          <MUITable stickyHeader className={props.classes.table}>
            <MUITableHead className={props.classes.tableHead}>
              <MUITableRow>
                <MUITableCell>Cube Name</MUITableCell>
                <MUITableCell>Description</MUITableCell>
              </MUITableRow>
            </MUITableHead>
            <MUITableBody className={props.classes.tableBody}>
              {props.cubes.map(function (cube) {
                return (
                  <MUITableRow key={cube._id}>
                    <MUITableCell>
                      <Link to={`/cube/${cube._id}`}>{cube.name}</Link>
                    </MUITableCell>
                    <MUITableCell>
                      {cube.description}
                    </MUITableCell>
                  </MUITableRow>
                );
              })}
            </MUITableBody>
          </MUITable>
        </MUITableContainer>
      </MUICardContent>
      {accountId === authentication.userId &&
        <MUICardActions className={props.classes.cardActions}>
          <MUIButton color="primary" onClick={() => setShowCubeForm(true)} variant="contained">Create a Cube</MUIButton>
          <MUIDialog open={showCubeForm} onClose={() => setShowCubeForm(false)}>
            <MUIDialogTitle>Create A New Cube</MUIDialogTitle>
            <MUIDialogContent>

              <MUITextField
                autoComplete="off"
                autoFocus
                fullWidth
                id="cube-name"
                label="Cube Name"
                required={true}
                type="text"
              />

              <MUITextField
                autoComplete="off"
                fullWidth
                id="cube-description"
                label="Description"
                multiline
                required={false}
                rows={3}
                type="text"
              />

            </MUIDialogContent>
            <MUIDialogActions>

              <MUIButton  color="primary" onClick={() => setShowCubeForm(false)} variant="contained">
                Cancel
              </MUIButton>

              <MUIButton color="primary" onClick={submitCubeForm} variant="contained">
                Create!
              </MUIButton>

            </MUIDialogActions>
          </MUIDialog>
        </MUICardActions>
      }
    </MUICard>
  );
};

export default UserCubeCard;