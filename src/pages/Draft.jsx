import React from 'react';
import { useParams } from 'react-router-dom';
import MUIAvatar from '@material-ui/core/Avatar';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUIGrid from '@material-ui/core/Grid';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// import LoadingSpinner from '../components/LoadingSpinner';
import { AuthenticationContext } from '../contexts/authentication-context';
// import { useRequest } from '../hooks/request-hook';

import io from "socket.io-client";

const draftReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_DRAFT':
      return {
        ...state,
        ...action.value
      };
    default:
      return state;
  }
}

const useStyles = makeStyles({
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  cardImage: {
    height: 300
  },
  cardImageContainer: {
    margin: '0 auto',
    padding: 0,
    width: 'fit-content'
  },
  gridContainer: {
    margin: 0,
    width: '100%'
  }
})

const Draft = () => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const draftId = useParams().draftId;
  // const { loading, sendRequest } = useRequest();
  const [errorMessage, setErrorMessage] = React.useState(undefined);
  const [socket, setSocket] = React.useState(undefined);

  const [draftState, dispatch] = React.useReducer(draftReducer, {
    drafters: [],
    name: '',
    pack: [],
    picks: []
  });

  React.useEffect(function () {
    updateDraftHandler({ action: 'UPDATE_DRAFT', value: {
      drafters: [],
      name: '',
      pack: [],
      picks: []
    }});
    setErrorMessage(undefined);
    setSocket(io(`http://localhost:5000`));
  }, []);

  React.useEffect(function () {
    if (socket) {

      socket.emit('join', draftId, authentication.userId);

      socket.on('admittance', function (draftInfo) {
        updateDraftHandler(draftInfo);
      });

      socket.on('bounce', function (error) {
        setErrorMessage(error);
      });

      socket.on('updateDraftStatus', function (draftInfo) {
        updateDraftHandler(draftInfo);
      });

      return function () {
        socket.emit('leave', draftId, authentication.userId);
        socket.disconnect();
      }
    }
  }, [socket]);

  function updateDraftHandler (data) {
    dispatch({ type: 'UPDATE_DRAFT', value: data });
  }

  return (
    <React.Fragment>
      {socket &&
        <div>
          <React.Fragment>
            {draftState.name &&
              <React.Fragment>
                <MUITypography variant="h2">{draftState.name}</MUITypography>
                {draftState.drafters.map(function (drafter) {
                  return (
                    <MUIAvatar alt={drafter.name} className={classes.avatarSmall} key={drafter.drafter} src={drafter.avatar} />
                  );
                })}
                <MUIGrid className={classes.gridContainer} container justify="space-between" spacing={2}>
                  {draftState.pack.map(function (card) {
                    return (
                      <MUIGrid
                        item
                        key={card._id}
                        xs={12}
                        sm={card.back_image ? 12 : 6}
                        md={card.back_image ? 8 : 4}
                        lg={card.back_image ? 6 : 3}
                        xl={card.back_image ? 4 : 2}
                      >
                        <MUIButton className={classes.cardImageContainer} onClick={() => socket.emit('selectCard', card._id, draftId, authentication.userId)}>
                          <img alt={card.name} className={classes.cardImage} src={card.image} />
                          {card.back_image &&
                            <img alt={card.name} className={classes.cardImage} src={card.back_image} />
                          }
                        </MUIButton>
                      </MUIGrid>
                    );
                  })}
                  {draftState.picks.length > 0 &&
                    <React.Fragment>
                      <MUIGrid item xs={12}>
                        <MUITypography variant="h3">Your Picks:</MUITypography>
                      </MUIGrid>
                      <React.Fragment>
                        {draftState.picks.map(function (card) {
                          return (
                            <MUIGrid
                            item
                            key={card._id}
                            xs={12}
                            sm={card.back_image ? 12 : 6}
                            md={card.back_image ? 8 : 4}
                            lg={card.back_image ? 6 : 3}
                            xl={card.back_image ? 4 : 2}
                          >
                            <MUICard className={classes.cardImageContainer}>
                              <img alt={card.name} className={classes.cardImage} src={card.image} />
                              {card.back_image &&
                                <img alt={card.name} className={classes.cardImage} src={card.back_image} />
                              }
                            </MUICard>
                          </MUIGrid>
                          );
                        })}
                      </React.Fragment>
                    </React.Fragment>
                  }
                </MUIGrid>
                {draftState.pack.length === 0 &&
                  draftState.picks.length === 0 &&
                  <p>Other drafters are still making their picks; yell at them to hurry up!</p>
                }
              </React.Fragment>
            }
          </React.Fragment>
          {errorMessage &&
            <p>{errorMessage}</p>
          }
        </div>
      }
    </React.Fragment>
  );
};

export default Draft;