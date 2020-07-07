import React from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '../components/LoadingSpinner';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const Draft = () => {

  const authentication = React.useContext(AuthenticationContext);
  const draftId = useParams().draftId;
  const { loading, sendRequest } = useRequest();
  const [draftStatus, setDraftStatus] = React.useState(undefined);
  
  React.useEffect(() => {
    const fetchDraftStatus = async function () {
      try {
        const draftData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/draft/${draftId}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + authentication.token }
        );
        setDraftStatus(draftData);
      } catch (error) {
        console.log('Error: ' + error.message);
      }
    };
    fetchDraftStatus();
  }, [draftId]);

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>
          {draftStatus &&
            <p>{draftStatus.lobby_name}</p>
          }
        </React.Fragment>
      }
    </React.Fragment>
  );
};

export default Draft;