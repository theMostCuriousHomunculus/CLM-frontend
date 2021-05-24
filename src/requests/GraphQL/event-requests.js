import axios from 'axios';

async function createEvent () {
  try {
    
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function fetchEventByID (eventId, token) {
  try {
    const graphqlQuery = {
      query: `
        query {
          fetchEventByID(_id: "${eventId}") {
            finished
            host {
              _id
            }
            name
            players {
              account {
                _id
                avatar
                name
              }
              chaff
              current_pack
              mainboard
              sideboard
            }
      `
    };
    const eventData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });

    return eventData.data.data.fetchEventByID;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function moveCard (cardID, destination, eventID, origin, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          moveCard(
            input: {
              cardID: ${cardID}
              destination: ${destination}
              eventID: ${eventID}
              origin: ${origin}
            }
          )
        }
      `
    };
    const eventData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });

    return eventData.data.data.moveCard;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function selectCard (cardID, eventID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          selectCard(
            input: {
              cardID: ${cardID}
              eventID: ${eventID}
            }
          )
        }
      `
    };
    const eventData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });

    return eventData.data.data.selectCard;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function sortCard (collection, eventID, newIndex, oldIndex, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          sortCard(
            input: {
              collection: ${collection}
              eventID: ${eventID}
              newIndex: ${newIndex}
              oldIndex: ${oldIndex}
            }
          )
        }
      `
    };
    const eventData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });

    return eventData.data.data.sortCard;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export {
  createEvent,
  fetchEventByID,
  moveCard,
  selectCard,
  sortCard
};