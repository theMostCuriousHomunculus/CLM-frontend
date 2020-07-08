import React from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '../components/LoadingSpinner';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

import io from "socket.io-client";

const Draft = () => {

  const authentication = React.useContext(AuthenticationContext);
  const draftId = useParams().draftId;
  // const { loading, sendRequest } = useRequest();
  const [draftStatus, setDraftStatus] = React.useState(undefined);
  const [socket, setSocket] = React.useState(undefined);

  React.useEffect(function () {
    setSocket(io(`http://localhost:5000`));
    return function () {
      socket.disconnect();
    }
  }, []);
  
  // React.useEffect(() => {
  //   const fetchDraftStatus = async function () {
  //     try {
  //       const draftData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/draft/${draftId}`,
  //         'GET',
  //         null,
  //         { Authorization: 'Bearer ' + authentication.token }
  //       );
  //       setDraftStatus(draftData);
  //     } catch (error) {
  //       console.log('Error: ' + error.message);
  //     }
  //   };
  //   fetchDraftStatus();
  // }, [draftId]);

  React.useEffect(function () {
    if (socket) {
      socket.emit('join', draftId, authentication.userId);
      socket.on('admittance', function (draftInfo) {
        setDraftStatus(draftInfo);
      });
    }
  }, [socket]);

  return (
    <React.Fragment>
      {socket &&
        <div>
          {draftStatus &&
            <React.Fragment>
              <p>{draftStatus.name}</p>
              <p>{draftStatus.host}</p>
            </React.Fragment>
          }
        </div>
      }
    </React.Fragment>
  );
};

export default Draft;