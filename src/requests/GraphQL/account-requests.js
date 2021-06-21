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
`;

export {
  desiredAccountInfo
};