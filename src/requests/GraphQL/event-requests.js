import axios from 'axios';

const desiredEventInfo = `finished
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
  chaff {
    _id
    back_image
    image
    mtgo_id
    name
  }
  current_pack {
    _id
    back_image
    image
    name
  }
  mainboard {
    _id
    back_image
    image
    mtgo_id
    name
  }
  sideboard {
    _id
    back_image
    image
    mtgo_id
    name
  }
}`

async function createEvent () {
  try {
    
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0]);
    } else {
      throw new Error(error);
    }
  }
}

async function fetchEventByID (eventId, token) {
  try {
    const graphqlQuery = {
      query: `
        query {
          fetchEventByID(_id: "${eventId}") {
            ${desiredEventInfo}
          }
        }
      `
    };
    const eventData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });

    if (eventData.data.errors) throw new Error(eventData.data.errors[0].message);

    return eventData.data.data.fetchEventByID;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0]);
    } else {
      throw new Error(error);
    }
  }
}

async function moveCard (cardID, destination, eventID, origin, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          moveCard(
            input: {
              cardID: "${cardID}"
              destination: ${destination}
              eventID: "${eventID}"
              origin: ${origin}
            }
          ) {
            ${desiredEventInfo}
          }
        }
      `
    };
    const eventData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });

    if (eventData.data.errors) throw new Error(eventData.data.errors[0].message);

    return eventData.data.data.moveCard;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0]);
    } else {
      throw new Error(error);
    }
  }
}

async function selectCard (cardID, eventID, token) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          selectCard(
            input: {
              cardID: "${cardID}"
              eventID: "${eventID}"
            }
          ) {
            ${desiredEventInfo}
          }
        }
      `
    };
    const eventData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });

    if (eventData.data.errors) throw new Error(eventData.data.errors[0].message);

    return eventData.data.data.selectCard;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0]);
    } else {
      throw new Error(error);
    }
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
              eventID: "${eventID}"
              newIndex: ${newIndex}
              oldIndex: ${oldIndex}
            }
          ) {
            ${desiredEventInfo}
          }
        }
      `
    };
    const eventData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: { Authorization: `Bearer ${token}` } });
    
    if (eventData.data.errors) throw new Error(eventData.data.errors[0].message);

    return eventData.data.data.sortCard;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0]);
    } else {
      throw new Error(error);
    }
  }
}

export {
  desiredEventInfo,
  createEvent,
  fetchEventByID,
  moveCard,
  selectCard,
  sortCard
};