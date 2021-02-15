import axios from 'axios';

async function addCard (cardData, componentId, cubeId, token) {
  try {
    const newCardId = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}/${componentId}`, cardData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return newCardId.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function createComponent () {
  try {
    
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function createCube () {
  try {
    
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function deleteCard (cardId, componentId, cubeId, token, destination = null) {
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}/${componentId}/${cardId}`, {
      data: {
        destination
      },
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function deleteComponent () {
  try {
    
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function deleteCube () {
  try {
    
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function editCard (changes, cardId, componentId, cubeId, token) {
  try {
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}/${componentId}/${cardId}`, changes, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function editComponent () {
  try {
    
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function editCube (changes, cubeId, token) {
  try {
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`, changes, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function fetchCubeById (cubeId) {
  try {
    const cube = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`);
    return cube.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

// async function searchCubes () {
//   try {
    
//   } catch (error) {
//     throw new Error(error.response.data.message);
//   }
// }

export {
  addCard,
  createComponent,
  createCube,
  deleteCard,
  deleteComponent,
  deleteCube,
  editCard,
  editComponent,
  editCube,
  fetchCubeById,
  // searchCubes
};