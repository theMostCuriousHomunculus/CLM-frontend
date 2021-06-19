// import axios from 'axios';

const desiredAccountInfo = `
  avatar
  buds {
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
    players {
      account {
        _id
        avatar
        name
      }
    }
  }
  matches {
    _id
    cube {
      _id
      name
    }
    event {
      _id
      createdAt
      name
    }
    players {
      account {
        _id
        avatar
        name
      }
    }
  }
  name
  received_bud_requests {
    _id
    avatar
    name
  }
  sent_bud_requests {
    _id
    avatar
    name
  }
`

// async function editAccount (changes, token) {
//   const { action, avatar, email, name, other_user_id, password } = changes;
//   try {
//     const graphqlQuery = {
//       query: `
//         mutation {
//           editAccount(
//             input: {
//               action: "${action}",
//               avatar: "${avatar}",
//               email: "${email}",
//               name: "${name}",
//               other_user_id: "${other_user_id}",
//               password: "${password}"
//             }
//           ) {
//             ${desiredAccountInfo}
//           }
//         }
//       `
//     };
//     const accountData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     if (accountData.data.errors) throw new Error(accountData.data.errors[0].message);

//     return accountData.data.data.editAccount;
//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.errors[0].message);
//     } else {
//       throw new Error(error);
//     }
//   }
// }

// async function fetchAccountByID (accountId, token) {
//   const headers = token ? { Authorization: `Bearer ${token}` } : null;

//   try {
//     const graphqlQuery = {
//       query: `
//         query {
//           fetchAccountByID(_id: "${accountId}") {
//             ${desiredAccountInfo}
//           }
//         }
//       `
//     };
//     const accountData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery, { headers });

//     if (accountData.data.errors) throw new Error(accountData.data.errors[0].message);

//     return accountData.data.data.fetchAccountByID;
//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.errors[0].message);
//     } else {
//       throw new Error(error);
//     }
//   }
// }

// async function login (email, password) {
//   try {
//     const graphqlQuery = {
//       query: `
//         mutation {
//           login(
//             input: {
//               email: "${email}",
//               password: "${password}"
//             }
//           ) {
//             isAdmin
//             token
//             userId
//           }
//         }
//       `
//     };
//     const credentials = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);

//     if (credentials.data.errors) throw new Error(credentials.data.errors[0].message);

//     return credentials.data.data.login;
//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.errors[0].message);
//     } else {
//       throw new Error(error);
//     }
//   }
// }

// async function logout (token) {
//   try {
//     const graphqlQuery = {
//       query: `
//         mutation {
//           logoutAllDevices
//         }
//       `
//     };

//     await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
//       graphqlQuery,
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//   } catch (error) {
//     throw new Error(error.response.data.errors[0].message);
//   }
// }

// async function register (email, name, password) {
//   try {
//     const randomCard = await axios.get('https://api.scryfall.com/cards/random');
//     const randomCardPrintings = await axios.get(randomCard.data.prints_search_uri);
//     const randomIndex = Math.floor(Math.random() * randomCardPrintings.data.data.length);
//     const avatar = randomCardPrintings.data.data[randomIndex].image_uris.art_crop;
//     const graphqlQuery = {
//       query: `
//         mutation {
//           register(
//             input: {
//               avatar: "${avatar}",
//               email: "${email}",
//               name: "${name}",
//               password: "${password}"
//             }
//           ) {
//             token
//             userId
//           }
//         }
//       `
//     };
//     const credentials = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);

//     if (credentials.data.errors) throw new Error(credentials.data.errors[0].message);

//     return credentials.data.data.register;
//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.errors[0].message);
//     } else {
//       throw new Error(error);
//     }
//   }
// }

// async function requestPasswordReset (email) {
//   try {
//     const graphqlQuery = {
//       query: `
//         mutation {
//           requestPasswordReset(email: "${email}")
//         }
//       `
//     };
//     const response = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);

//     if (response.data.errors) throw new Error(response.data.errors[0].message);

//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.errors[0].message);
//     } else {
//       throw new Error(error);
//     }
//   }
// }

// async function searchAccounts (name) {
//   try {
//     const graphqlQuery = {
//       query: `
//         query {
//           searchAccounts(name: "${name}") {
//             _id
//             avatar
//             name
//           }
//         }
//       `
//     };
//     const matchingUsers = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);

//     if (matchingUsers.data.errors) throw new Error(matchingUsers.data.errors[0].message);

//     return matchingUsers.data.data.searchAccounts;
//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.errors[0].message);
//     } else {
//       throw new Error(error);
//     }
//   }
// }

// async function submitPasswordReset (email, newPassword, resetToken) {
//   try {
//     const graphqlQuery = {
//       query: `
//         mutation {
//           submitPasswordReset(
//             input: {
//               email: "${email}"
//               password: "${newPassword}"
//               reset_token: "${resetToken}"
//             }
//           ) {
//             isAdmin
//             token
//             userId
//           }
//         }
//       `
//     };
//     const credentials = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL, graphqlQuery);

//     if (credentials.data.errors) throw new Error(credentials.data.errors[0].message);

//     return credentials.data.data.submitPasswordReset;
//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.errors[0].message);
//     } else {
//       throw new Error(error);
//     }
//   }
// }

export {
  desiredAccountInfo,
  // editAccount,
  // fetchAccountByID,
  // login,
  // logout,
  // register,
  // requestPasswordReset,
  // searchAccounts,
  // submitPasswordReset
};