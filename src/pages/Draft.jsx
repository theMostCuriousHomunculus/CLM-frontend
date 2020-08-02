import React from 'react';
import { useParams } from 'react-router-dom';
import { CSVLink } from "react-csv";
import MUIAvatar from '@material-ui/core/Avatar';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUIGrid from '@material-ui/core/Grid';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

import io from "socket.io-client";
import SelectConfirmationDialogue from '../components/SelectConfirmationDialog';

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
  downloadLink: {
    fontSize: '1.6rem'
  },
  draftersList: {
    padding: 8
  },
  gridContainer: {
    margin: 0,
    width: '100%'
  }
});

const Draft = () => {

  const authentication = React.useContext(AuthenticationContext);
  const { sendRequest } = useRequest();
  const classes = useStyles();
  const draftId = useParams().draftId;
  const [dialogueDisplayed, setDialogueDisplayed] = React.useState(false);
  const [drafterUsername, setDrafterUsername] = React.useState(undefined);
  const [errorMessage, setErrorMessage] = React.useState(undefined);
  const [selectedCard, setSelectedCard] = React.useState(undefined);
  const [socket, setSocket] = React.useState(undefined);

  const [draftState, dispatch] = React.useReducer(draftReducer, {
    drafters: [],
    name: '',
    other_drafters_picks: [],
    pack: [],
    picks: []
  });

  React.useEffect(function () {
    async function fetchData () {
      const accountData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/account/${authentication.userId}`,
        'GET',
        null,
        { Authorization: 'Bearer ' + authentication.token }
      );
      setDrafterUsername(accountData.name);
    }
    fetchData();
    updateDraftHandler({ action: 'UPDATE_DRAFT', value: {
      drafters: [],
      name: '',
      other_drafters_picks: [],
      pack: [],
      picks: []
    }});
    setErrorMessage(undefined);
    setSocket(io(`${process.env.REACT_APP_BACKEND_URL.replace('/api', '')}`));
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

  function selectCardHandler (cardId) {
    socket.emit('selectCard', cardId, draftId, authentication.userId);
  }

  return (
    <React.Fragment>
      {socket &&
        <div>
          <SelectConfirmationDialogue
            card={selectedCard}
            open={dialogueDisplayed}
            selectCardHandler={selectCardHandler}
            toggleOpen={() => setDialogueDisplayed(false)}
          />
          <React.Fragment>
            {draftState.name &&
              <React.Fragment>
                <div className={classes.draftersList}>
                  <MUITypography variant="h2">{draftState.name}</MUITypography>
                  {draftState.drafters.map(function (drafter) {
                    return (
                      <MUIAvatar alt={drafter.name} className={classes.avatarSmall} key={drafter.drafter} src={drafter.avatar} />
                    );
                  })}
                </div>
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
                        <MUIButton
                          className={classes.cardImageContainer}
                          onClick={() => {
                            setSelectedCard(card);
                            setDialogueDisplayed(true)
                          }}>
                          <img alt={card.name} className={classes.cardImage} src={card.image} />
                          {card.back_image &&
                            <img alt={card.name} className={classes.cardImage} src={card.back_image} />
                          }
                        </MUIButton>
                      </MUIGrid>
                    );
                  })}
                  {// displays if the drafter who passes to this drafter has not yet made his pick
                    draftState.pack.length === 0 &&
                    draftState.picks.length === 0 &&
                    <MUITypography variant="body1">
                      Other drafters are still making their picks; yell at them to hurry up!
                    </MUITypography>
                  }
                  {// displays once the drafter has made all their picks
                    draftState.picks.length > 0 &&
                    <React.Fragment>
                      <MUIGrid item xs={12}>
                        <MUITypography variant="h3">Your Picks:</MUITypography>
                        <CSVLink
                          className={classes.downloadLink}
                          data={draftState.picks.reduce(function (a, c) {
                            return a + " ,1," + c.mtgo_id + ", , , , \n";
                          }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium\n")}
                          filename={`${draftState.name + " - " + drafterUsername}.csv`}
                          target="_blank"
                        >
                          Download your picks in CSV format for MTGO drafting!
                        </CSVLink>
                        {draftState.other_drafters_picks.map(function (drftr) {
                          return (
                            <React.Fragment>
                              <br />
                              <CSVLink
                                className={classes.downloadLink}
                                data={drftr.picks.reduce(function (a, c) {
                                  return a + " ,1," + c + ", , , , \n";
                                }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium\n")}
                                filename={`${draftState.name + " - " + drftr.name}.csv`}
                                target="_blank"
                              >
                                Download {drftr.name}'s picks in CSV format for MTGO drafting!
                              </CSVLink>
                            </React.Fragment>
                          );
                        })}
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
              </React.Fragment>
            }
          </React.Fragment>
          {errorMessage &&
            <MUITypography variant="body1">{errorMessage}</MUITypography>
          }
        </div>
      }
    </React.Fragment>
  );
};

export default Draft;