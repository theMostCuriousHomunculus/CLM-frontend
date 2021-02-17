import axios from 'axios';

async function editAccount (changes, token) {
  try {
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/account`, changes, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function fetchAccountById (accountId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : null;
  try {
    const accountData = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/account/${accountId}`, { headers });
    return accountData.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function login (email, password) {
  try {
    const credentials = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/account/login`, { email, password });
    return credentials.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function logout (token) {
  try {
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/account/logoutAll`, null, {
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
    const credentials = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/account`, { avatar, email, name, password });
    return credentials.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function requestPasswordReset (email) {
  try {
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/account/reset`, { email });
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function submitPasswordReset (email, newPassword, resetToken) {
  try {
    const credentials = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/account/reset/${resetToken}`, {
      email,
      password: newPassword
    });
    return credentials.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export {
  editAccount,
  fetchAccountById,
  login,
  logout,
  register,
  requestPasswordReset,
  submitPasswordReset
};