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

// async function searchCubes () {
//   try {
    
//   } catch (error) {
//     throw new Error(error.response.data.message);
//   }
// }

export {
  desiredCubeInfo,
  // searchCubes
};