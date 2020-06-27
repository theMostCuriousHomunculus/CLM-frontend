import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';
import Modal from '../components/Modal';

const Account = () => {

  const accountId = useParams().accountId;
  const authentication = useContext(AuthenticationContext);
  const history = useHistory();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  const [user, setUser] = useState({});

  // const [avatar, setAvatar] = useState('');
  // const [buds, setBuds] = useState([]);
  const [cubes, setCubes] = useState([]);
  // const [email, setEmail] = useState('');
  // const [name, setName] = useState('');
  // const [receivedBudRequests, setReceivedBudRequests] = useState([]);
  // const [sentBudRequests, setSentBudRequests] = useState([]);
  const [showCubeForm, setShowCubeForm] = useState(false);

  useEffect(() => {
    const fetchAccount = async function () {
      try {
        const headers = authentication.token ? { Authorization: 'Bearer ' + authentication.token } : {};
        const accountData = await sendRequest('http://localhost:5000/api/account/' + accountId, 'GET', null, headers);
        // setAvatar(accountData.avatar);
        // setBuds(accountData.buds);
        // setEmail(accountData.email);
        // setName(accountData.name);
        // setReceivedBudRequests(accountData.received_bud_requests);
        // setSentBudRequests(accountData.sent_bud_requests);
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

  async function submitCubeForm (event) {
    event.preventDefault();
    let formInputs = {};
    formInputs.name = document.getElementById('cube-name').value;
    formInputs.description = document.getElementById('cube-description').value ?
      document.getElementById('cube-description').value :
      undefined;

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
      <h2>Basic Info</h2>
      <ul>
        <li>{user.name}</li>
        {accountId === authentication.userId &&
          <li>{user.email}</li>
        }
        {user.avatar &&
          <li>
            <div className="circle-avatar-container">
              <img alt="avatar" className="avatar" src={user.avatar} />
            </div>
          </li>
        }
      </ul>
      <h2>Cubes</h2>
      {cubes &&
        <ul>
          {cubes && cubes.map(function (cube) {
              return <li key={cube._id}><Link to={`/cube/${cube._id}`}>{cube.name}</Link></li>
          })}
        </ul>
      }
      {accountId === authentication.userId &&
        <button onClick={openCubeForm}>Create a Cube</button>
      }
      <h2>Buds</h2>
      <ul>
        {user.buds &&
          user.buds.map(function (bud) {
            return (
              <li key={bud}>
                {bud.avatar &&
                  <div className="circle-avatar-container">
                    <img alt="avatar" className="avatar" src={bud.avatar} />
                  </div>
                }
                <Link to={`/account/${bud._id}`}>{bud.name}</Link>
              </li>
            );
          })
        }
      </ul>
      {accountId === authentication.userId &&
        <React.Fragment>
          <h2>Aspiring Buds</h2>
          <ul>
            {user.received_bud_requests &&
              user.received_bud_requests.map(function (request) {
                return (
                  <li key={request._id}>
                    {request.avatar &&
                      <div className="circle-avatar-container">
                        <img alt="avatar" className="avatar" src={request.avatar} />
                      </div>
                    }
                    <Link to={`/account/${request._id}`}>{request.name}</Link>
                  </li>
                );
              })
            }
          </ul>
        </React.Fragment>
      }
      {accountId === authentication.userId &&
        <React.Fragment>
          <h2>Pending Buds</h2>
          <ul>
            {user.sent_bud_requests &&
              user.sent_bud_requests.map(function (request) {
                return (
                  <li key={request._id}>
                    {request.avatar &&
                      <div className="circle-avatar-container">
                        <img alt="avatar" className="avatar" src={request.avatar} />
                      </div>
                    }
                    <Link to={`/account/${request._id}`}>{request.name}</Link>
                  </li>
                );
              })
            }
          </ul>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default Account;