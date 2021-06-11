import axios from 'axios';

const desiredMatchInfo = `game_winners {
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
    const matchData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          MatchID: matchID
        }
      });

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

async function tapUntapCard (cardID, matchID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          tapUntapCard(_id: "${cardID}") {
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

    return matchData.data.data.tapUntapCard;
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
  fetchMatchByID,
  tapUntapCard
};