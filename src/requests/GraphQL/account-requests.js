import axios from 'axios';

async function editAccount (changes, token) {
  const { action, avatar, email, name, other_user_id, password } = changes;
  try {
    const graphqlQuery = {
      query: `
        mutation {
          editAccount(
            input: {
              action: "${action}",
              avatar: "${avatar}",
              email: "${email}",
              name: "${name}",
              other_user_id: "${other_user_id}",
              password: "${password}"
            }
          )
        }
      `
    };
    await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw new Error(error.response.data.errors[0]);
  }
}

async function fetchAccountById (accountId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : null;
  try {
    const graphqlQuery = {
      query: `
        query {
          fetchAccountByID(_id: "${accountId}") {
            avatar
            buds {
              _id
              avatar
              name
            }
            name
            sent_bud_requests {
              _id
              avatar
              name
            }
            received_bud_requests {
              _id
              avatar
              name
            }
            cubes {
              _id
              description
              mainboard {
                _id
              }
              modules {
                _id
                cards {
                  _id
                }
                name
              }
              name
              rotations {
                _id
                cards {
                  _id
                }
                name
                size
              }
              sideboard {
                _id
              }
            }
            events {
              _id
              createdAt
              host {
                _id
                avatar
                name
              }
              name
            }
          }
        }
      `
    };
    const accountData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery, { headers });

    return accountData.data.data.fetchAccountByID;
  } catch (error) {
    throw new Error(error.response.data.errors[0]);
  }
}

async function login (email, password) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          login(
            input: {
              email: "${email}",
              password: "${password}"
            }
          ) {
            isAdmin
            token
            userId
          }
        }
      `
    };
    const credentials = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);
    console.log(credentials);
    return credentials.data.data.login;
  } catch (error) {
    throw new Error(error.response.data.errors[0]);
  }
}

async function logout (token) {
  try {
    await axios.patch(`${process.env.REACT_APP_REST_URL}/account/logoutAll`, null, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function register (email, name, password) {
  try {
    const randomCard = await axios.get('https://api.scryfall.com/cards/random');
    const randomCardPrintings = await axios.get(randomCard.data.prints_search_uri);
    const randomIndex = Math.floor(Math.random() * randomCardPrintings.data.data.length);
    const avatar = randomCardPrintings.data.data[randomIndex].image_uris.art_crop;
    const graphqlQuery = {
      query: `
        mutation {
          register(
            input: {
              avatar: "${avatar}",
              email: "${email}",
              name: "${name}",
              password: "${password}"
            }
          ) {
            token
            userId
          }
        }
      `
    };
    const credentials = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);

    return credentials.data.data.register;
  } catch (error) {
    throw new Error(error.response.data.errors[0]);
  }
}

async function requestPasswordReset (email) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          requestPasswordReset(email: "${email}")
        }
      `
    };
    await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);
  } catch (error) {
    throw new Error(error.response.data.errors[0]);
  }
}

async function searchAccounts (name) {
  try {
    const graphqlQuery = {
      query: `
        query {
          searchAccounts(name: "${name}") {
            _id
            avatar
            name
          }
        }
      `
    };
    const matchingUsers = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);
    return matchingUsers.data.data.searchAccounts;
  } catch (error) {
    throw new Error(error.response.data.errors[0]);
  }
}

async function submitPasswordReset (email, newPassword, resetToken) {
  try {
    const graphqlQuery = {
      query: `
        mutation {
          submitPasswordReset(
            input: {
              email: "${email}"
              password: "${newPassword}"
              reset_token: "${resetToken}"
            }
          ) {
            isAdmin
            token
            userId
          }
        }
      `
    };
    const credentials = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);
    return credentials.data.data.submitPasswordReset;
  } catch (error) {
    throw new Error(error.response.data.errors[0]);
  }
}

export {
  editAccount,
  fetchAccountById,
  login,
  logout,
  register,
  requestPasswordReset,
  searchAccounts,
  submitPasswordReset
};