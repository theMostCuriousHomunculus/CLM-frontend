import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Avatar as MUIAvatar,
  Button as MUIButton,
  Card as MUICard,
  CardActions as MUICardActions,
  CardContent as MUICardContent,
  CardHeader as MUICardHeader,
  Grid as MUIGrid,
  List as MUIList,
  ListItem as MUIListItem,
  Typography as MUITypography
} from '@material-ui/core';
import {
  PersonAdd as MUIPersonAddIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';
import BudRequests from '../components/BudRequests';
import Modal from '../components/Modal';

const useStyles = makeStyles({
  avatarLarge: {
    height: '150px',
    width: '150px'
  },
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  basicCard: {
    margin: '1rem'
  },
  cardActions: {
    justifyContent: 'flex-end'
  },
  flexGrow: {
    flexGrow: 1
  },
  inline: {
    display: 'inline'
  },
  warningButton: {
    backgroundColor: '#ff0000',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#df2000'
    }
  }
});

const Account = () => {

  const accountId = useParams().accountId;
  const authentication = useContext(AuthenticationContext);
  const classes = useStyles();
  const history = useHistory();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  const [user, setUser] = useState({});
  const [cubes, setCubes] = useState([]);
  const [showCubeForm, setShowCubeForm] = useState(false);

  useEffect(() => {
    const fetchAccount = async function () {
      try {
        const headers = authentication.token ? { Authorization: 'Bearer ' + authentication.token } : {};
        const accountData = await sendRequest(`http://localhost:5000/api/account/${accountId}`, 'GET', null, headers);
        setUser(accountData);
        const cubeData = await sendRequest(`http://localhost:5000/api/cube?creator=${accountId}`, 'GET', null, {});
        setCubes(cubeData.cubes);
      } catch (error) {
        console.log('Error: ' + error.message);
      }
    };
    fetchAccount();
  }, [accountId, authentication.token, sendRequest]);

  function closeCubeForm () {
    setShowCubeForm(false);
  }

  function openCubeForm () {
    setShowCubeForm(true);
  }

  function deleteBud (event) {
    let formData = {
      action: 'remove',
      other_user_id: event.currentTarget.getAttribute('data-id')
    };

    sendRequest('http://localhost:5000/api/account',
      'PATCH',
      JSON.stringify(formData),
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
  }

  function sendBudRequest (event) {
    let formData = {
      action: 'send',
      other_user_id: event.currentTarget.getAttribute('data-id')
    };

    sendRequest('http://localhost:5000/api/account',
      'PATCH',
      JSON.stringify(formData),
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
  }

  async function submitCubeForm (event) {
    event.preventDefault();
    let formInputs = {};
    formInputs.name = document.getElementById('cube-name').value;
    formInputs.description = document.getElementById('cube-description').value ?
      document.getElementById('cube-description').value :
      undefined;

    console.log(formInputs);
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/cube',
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
    <React.Fragment>
      <Modal
        action="http://localhost:5000/api/cube"
        contentClass="create-cube__modal-content"
        footerClass="create-cube__modal-acitons"
        footer={<button onClick={closeCubeForm}>Cancel</button>}
        header="Create a New Cube!"
        method="POST"
        onCancel={closeCubeForm}
        onSubmit={submitCubeForm}
        show={showCubeForm}
      >
        <input
          autoComplete="off"
          id="cube-name"
          name="name"
          placeholder="Cube Name"
          required={true}
          type="text"
        />
        <textarea
          autoComplete="off"
          id="cube-description"
          name="description"
          placeholder="Description"
          required={false}
          type="text"
        />
        <button>Create!</button>
      </Modal>

      <MUICard className={classes.basicCard}>
        <MUICardHeader
          avatar={user.avatar && <MUIAvatar alt={user.name} className={classes.avatarLarge} src={user.avatar} />}
          title={<MUITypography variant="h2">{user.name}</MUITypography>}
          subheader={accountId === authentication.userId ? <MUITypography variant="h3">{user.email}</MUITypography> : null}
        />
        {accountId !== authentication.userId &&
          <MUICardActions className={classes.cardActions}>
            <MUIButton
              color="primary"
              data-id={accountId}
              onClick={sendBudRequest}
              variant="contained"
            >
              <MUIPersonAddIcon />
            </MUIButton>
          </MUICardActions>
        }
      </MUICard>

      <MUICard className={classes.basicCard}>
        <MUICardHeader title={<MUITypography variant="h3">Cubes</MUITypography>} />
        <MUICardContent>
          <MUIList>
            {cubes.map(function (cube) {
              return (
                <MUIListItem className={classes.inline} key={cube._id}>
                  <MUIButton
                    color="secondary"
                    onClick={() => history.push(`/cube/${cube._id}`)}
                    variant="contained"
                  >
                    {cube.name}
                  </MUIButton>
                </MUIListItem>
              );
            })}
          </MUIList>
        </MUICardContent>
        {accountId === authentication.userId &&
          <MUICardActions className={classes.cardActions}>
            <MUIButton color="primary" onClick={openCubeForm} variant="contained">Create a Cube</MUIButton>
          </MUICardActions>
        }
      </MUICard>

      <MUIGrid container>
        <MUIGrid item xs={12} sm={6} md={4}>
          <MUICard className={classes.basicCard}>
            <MUICardHeader title={<MUITypography variant="h3">Buds</MUITypography>} />
            <MUIList>
              {user.buds &&
                user.buds.map(function (bud) {
                  return (
                    <MUIListItem key={bud._id}>
                      {bud.avatar &&
                        <MUIAvatar alt={bud.name} className={classes.avatarSmall} src={bud.avatar} />
                      }
                      <Link className={classes.flexGrow} to={`/account/${bud._id}`}>{bud.name}</Link>
                      {accountId === authentication.userId &&
                        <MUIButton
                          className={classes.warningButton}
                          data-id={bud._id}
                          onClick={deleteBud}
                          variant="contained"
                        >
                          Delete Bud
                        </MUIButton>
                      }
                    </MUIListItem>
                  );
                })
              }
            </MUIList>
          </MUICard>
        </MUIGrid>

        {accountId === authentication.userId &&
          <BudRequests user={user} />
        }
      </MUIGrid>
    </React.Fragment>
  );
}

export default Account;