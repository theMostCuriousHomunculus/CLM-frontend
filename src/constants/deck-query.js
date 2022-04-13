export default `{
  _id
  cards {
    _id
    mainboard_count
    maybeboard_count
    scryfall_card {
      _id
      card_faces {
        image_uris {
          large
        }
        mana_cost
        name
        oracle_text
      }
      cmc
      collector_number
      image_uris {
        large
      }
      legalities {
        banned
        legal
        not_legal
        restricted
      }
      mana_cost
      mtgo_id
      name
      oracle_text
      rarity
      _set
      type_line
    }
    sideboard_count
  }
  creator {
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
  published
}`;
