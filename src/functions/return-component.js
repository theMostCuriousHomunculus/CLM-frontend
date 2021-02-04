function returnComponent (cube, componentID) {

  let component;

  const module = cube.modules.find(function (mdl) {
    return mdl._id === componentID;
  });
  const rotation = cube.rotations.find(function (rtn) {
    return rtn._id === componentID;
  });

  if (componentID === 'mainboard') {
    component = cube.mainboard;
  } else if (componentID === 'sideboard') {
    component = cube.sideboard;
  } else if (module) {
    component = module.cards;
  } else if (rotation) {
    component = rotation.cards;
  } else {
    // leave component undefined
  }
  
  return component;
}

export default returnComponent;