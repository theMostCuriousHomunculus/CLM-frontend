export default `{
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
  comments {
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
    updatedAt
  }
  image
  published
  subtitle
  title
  createdAt
  updatedAt
}`;
