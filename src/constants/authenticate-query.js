export default `{
  _id
  admin
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
  conversations {
    messages {
      _id
      author {
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
      body
      createdAt
    }
    participants {
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
  name
  measurement_system
  radius
}`;
