import axios from 'axios';

const desiredCardInfo = `
  _id
  back_image
  chapters
  cmc
  color_identity
  image
  keywords
  loyalty
  mana_cost
  mtgo_id
  name
  oracle_id
  power
  printing
  purchase_link
  toughness
  type_line
`;

const desiredCubeInfo = `
  _id
  creator {
    _id
    avatar
    name
  }
  description
  mainboard {
    ${desiredCardInfo}
  }
  modules {
    _id
    cards {
      ${desiredCardInfo}
    }
    name
  }
  name
  rotations {
    _id
    cards {
      ${desiredCardInfo}
    }
    name
    size
  }
  sideboard {
    ${desiredCardInfo}
  }
`;

async function addCard (cardData, componentID, cubeID, token) {

  const {
    back_image,
    chapters,
    cmc,
    color_identity,
    image,
    keywords,
    loyalty,
    mana_cost,
    mtgo_id,
    name,
    oracle_id,
    power,
    printing,
    purchase_link,
    toughness,
    type_line
  } = cardData;

  try {
    const graphqlQuery = {
      query: `
        mutation {
          addCard(
            input: {
              componentID: "${componentID}",
              back_image: "${back_image}",
              chapters: ${chapters},
              cmc: ${cmc},
              color_identity: [${color_identity.map(ci => '"' + ci + '"')}],
              image: "${image}",
              keywords: [${keywords.map(kw => '"' + kw + '"')}],
              loyalty: ${loyalty},
              mana_cost: "${mana_cost}",
              mtgo_id: ${mtgo_id},
              name: ${name},
              oracle_id: "${oracle_id}",
              power: ${power},
              printing: "${printing}",
              purchase_link: "${purchase_link}",
              toughness: ${toughness},
              type_line: "${type_line}"
            }
          ) {
            ${desiredCubeInfo}
          }
        }
      `
    };
    const cubeData = await axios.post(process.env.REACT_APP_GRAPHQL_HTTP_URL,
      graphqlQuery,
      { headers: {
          Authorization: `Bearer ${token}`,
          CubeID: cubeID
        }
      });

    if (cubeData.data.errors) throw new Error(cubeData.data.errors[0].message);

    return cubeData.data.data.addCard;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function createModule (cubeId, details, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function createRotation (cubeId, details, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function createCube (cubeDetails, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function deleteCard (cardId, componentId, cubeId, token, destination = null) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function deleteCube (cubeId, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function deleteModule (moduleId, cubeId, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function deleteRotation (rotationId, cubeId, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function editCard (changes, cardId, componentId, cubeId, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function editCube (changes, cubeId, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function editModule (changes, componentId, cubeId, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function editRotation (changes, componentId, cubeId, token) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

async function fetchCubeById (cubeId) {
  try {

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw new Error(error);
    }
  }
}

// async function searchCubes () {
//   try {
    
//   } catch (error) {
//     throw new Error(error.response.data.message);
//   }
// }

export {
  desiredCubeInfo,
  addCard,
  createCube,
  createModule,
  createRotation,
  deleteCard,
  deleteCube,
  deleteModule,
  deleteRotation,
  editCard,
  editCube,
  editModule,
  editRotation,
  fetchCubeById,
  // searchCubes
};