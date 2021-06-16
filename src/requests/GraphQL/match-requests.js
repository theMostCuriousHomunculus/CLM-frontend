import axios from 'axios';

const desiredMatchInfo = `
_id
game_winners {
  _id
  avatar
  name
}
log
players {
  account {
    _id
    avatar
    name
  }
  battlefield {
    _id
    back_image
    controller {
      _id
    }
    counters {
      counterAmount
      counterType
    }
    face_down_image
    flipped
    image
    isCopyToken
    name
    owner {
      _id
    }
    tapped
    targets {
      _id
    }
    tokens {
      name
      scryfall_id
    }
    visibility {
      _id
    }
    x_coordinate
    y_coordinate
    z_index
  }
  energy
  exile {
    _id
    back_image
    controller {
      _id
    }
    counters {
      counterAmount
      counterType
    }
    face_down_image
    flipped
    image
    name
    owner {
      _id
    }
    targets {
      _id
    }
    tokens {
      name
      scryfall_id
    }
    visibility {
      _id
    }
  }
  graveyard {
    _id
    back_image
    controller {
      _id
    }
    counters {
      counterAmount
      counterType
    }
    face_down_image
    flipped
    image
    name
    owner {
      _id
    }
    targets {
      _id
    }
    tokens {
      name
      scryfall_id
    }
    visibility {
      _id
    }
  }
  hand {
    _id
    back_image
    controller {
      _id
    }
    face_down_image
    flipped
    image
    name
    owner {
      _id
    }
    targets {
      _id
    }
    tokens {
      name
      scryfall_id
    }
    visibility {
      _id
    }
  }
  library {
    _id
    back_image
    controller {
      _id
    }
    face_down_image
    image
    name
    owner {
      _id
    }
    visibility {
      _id
    }
  }
  life
  poison
  mainboard {
    _id
    back_image
    image
    name
    tapped
    x_coordinate
    y_coordinate
    z_index
  }
  sideboard {
    _id
    back_image
    face_down_image
    image
    name
    visibility {
      _id
    }
  }
  temporary {
    _id
    back_image
    face_down_image
    image
    index
    isCopyToken
    name
    visibility {
      _id
    }
  }
}
stack {
  _id
  back_image
  controller {
    _id
  }
  counters {
    counterAmount
    counterType
  }
  face_down_image
  image
  isCopyToken
  name
  owner {
    _id
  }
  targets {
    _id
  }
  tokens {
    name
    scryfall_id
  }
  visibility {
    _id
  }
}`;

async function adjustEnergyCounters (energy, matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          adjustEnergyCounters(energy: ${energy}) {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.adjustEnergyCounters;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function adjustLifeTotal (life, matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          adjustLifeTotal(life: ${life}) {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.adjustLifeTotal;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function adjustPoisonCounters (poison, matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          adjustPoisonCounters(poison: ${poison}) {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.adjustPoisonCounters;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function createMatch (eventId, playerIds, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          createMatch(
            input: {
              eventID: "${eventId}",
              playerIDs: ${playerIds.map(plrID => '"' + plrID + '"')}
            }
          ) {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.createMatch;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function dragCard (cardID, xCoordinate, yCoordinate, zIndex, matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          dragCard(
            input: {
              cardID: "${cardID}",
              xCoordinate: ${xCoordinate},
              yCoordinate: ${yCoordinate},
              zIndex: ${zIndex}
            }
          ) {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.dragCard;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function drawCard (matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          drawCard {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.drawCard;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function fetchMatchByID (matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        query {
          fetchMatchByID {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const headers = {
      MatchID: matchID
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.fetchMatchByID;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function rollDice (sides, matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          rollDice(sides: ${sides}) {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.rollDice;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function shuffleLibrary (matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          shuffleLibrary {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.shuffleLibrary;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function tapUntapCards (cardIDs, matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          tapUntapCards(
            input: {
              cardIDs: [${cardIDs.map(id => '"' + id + '"')}]
            }
          ) {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.tapUntapCards;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function transferCard (cardID, destinationZone, index, originZone, reveal, shuffle, matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          transferCard(
            input: {
              cardID: "${cardID}",
              destinationZone: ${destinationZone},
              index: ${index},
              originZone: ${originZone},
              reveal: ${reveal},
              shuffle: ${shuffle}
            }
          ) {
            ${desiredMatchInfo}
          }
        }
      `
    };
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

    if (matchData.data.errors) throw new Error(matchData.data.errors[0].message);

    return matchData.data.data.transferCard;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

export {
  desiredMatchInfo,
  adjustEnergyCounters,
  adjustLifeTotal,
  adjustPoisonCounters,
  createMatch,
  dragCard,
  drawCard,
  fetchMatchByID,
  rollDice,
  shuffleLibrary,
  tapUntapCards,
  transferCard
};