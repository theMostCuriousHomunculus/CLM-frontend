import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITypography from '@material-ui/core/Typography';

import CreateCubeForm from './CreateCubeForm';
import { AuthenticationContext } from '../../contexts/authentication-context';

const UserCubeCard = (props) => {

  const { cubes, pageClasses } = props;

  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);

  const [showCubeForm, setShowCubeForm] = React.useState(false);

  return (
    <React.Fragment>
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