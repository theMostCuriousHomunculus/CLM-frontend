export default `{
_id
avatar {
  card_faces {
    image_uris {
      art_crop
    }
  }
  image_uris {
    art_crop
  }
}
buds {
  _id
  avatar {
    card_faces {
      image_uris {
        art_crop
      }
    }
    image_uris {
      art_crop
    }
  }
  buds {
    _id
    avatar {
      card_faces {
        image_uris {
          art_crop
        }
      }
      image_uris {
        art_crop
      }
    }
    name
  }
  decks {
    _id
    format
    name
  }
  name
}
cubes {
  _id
  description
  image {
    _id
    image_uris {
      art_crop
    }
    name
    card_faces {
      image_uris {
        art_crop
      }
      name
    }
  }
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
decks {
  _id
  description
  format
  image {
    _id
    image_uris {
      art_crop
    }
    name
    card_faces {
      image_uris {
        art_crop
      }
      name
    }
  }
  name
}
email
events {
  _id
  createdAt
  cube {
    _id
    image {
      _id
      image_uris {
        art_crop
      }
      name
      card_faces {
        image_uris {
          art_crop
        }
        name
      }
    }
    name
  }
  host {
    _id
    avatar {
      card_faces {
        image_uris {
          art_crop
        }
      }
      image_uris {
        art_crop
      }
    }
    name
  }
  name
  players {
    account {
      _id
      avatar {
        card_faces {
          image_uris {
            art_crop
          }
        }
        image_uris {
          art_crop
        }
      }
      name
    }
  }
}
location {
  coordinates
}
matches {
  _id
  createdAt
  cube {
    _id
    name
  }
  decks {
    _id
    format
    name
  }
  event {
    _id
    name
  }
  players {
    account {
      _id
      avatar {
        card_faces {
          image_uris {
            art_crop
          }
        }
        image_uris {
          art_crop
        }
      }
      name
    }
  }
}
measurement_system
name
nearby_users {
  _id
  avatar {
    card_faces {
      image_uris {
        art_crop
      }
    }
    image_uris {
      art_crop
    }
  }
  name
}
radius
received_bud_requests {
  _id
  avatar {
    card_faces {
      image_uris {
        art_crop
      }
    }
    image_uris {
      art_crop
    }
  }
  name
}
sent_bud_requests {
  _id
  avatar {
    card_faces {
      image_uris {
        art_crop
      }
    }
    image_uris {
      art_crop
    }
  }
  name
}
total_events
}`;
