export default async function cacheScryfallData(scryfallCardData) {
  let art_crop, back_image, image, mana_cost, meldResult, type_line;
  switch (scryfallCardData.layout) {
    case 'adventure':
      // this mechanic debuted in Throne of Eldrain.  all adventure cards are either (instants or sorceries) and creatures.  it seems to have been popular, so it may appear again
      art_crop = scryfallCardData.image_uris.art_crop;
      image = scryfallCardData.image_uris.large;
      mana_cost = `${scryfallCardData.card_faces[0].mana_cost}${scryfallCardData.card_faces[1].mana_cost}`;
      type_line = `${scryfallCardData.card_faces[0].type_line} / ${scryfallCardData.card_faces[1].type_line}`;
      break;
    case 'flip':
      // flip was only in Kamigawa block (plus an "Un" card and a couple of reprints), which was before planeswalkers existed.  unlikely they ever bring this layout back, and if they do, no idea how they would fit a planeswalker onto one side.  all flip cards are creatures on one end and either a creature or an enchantment on the other
      art_crop = scryfallCardData.image_uris.art_crop;
      image = scryfallCardData.image_uris.large;
      mana_cost = scryfallCardData.card_faces[0].mana_cost;
      type_line = `${scryfallCardData.card_faces[0].type_line} / ${scryfallCardData.card_faces[1].type_line}`;
      break;
    case 'leveler':
      // all level up cards have been creatures.  this is a mechanic that has so far only appeared in Rise of the Eldrazi and a single card in Modern Horizons.  i don't expect the mechanic to return, but the printing of Hexdrinker in MH1 suggests it may
      art_crop = scryfallCardData.image_uris.art_crop;
      image = scryfallCardData.image_uris.large;
      mana_cost = scryfallCardData.mana_cost;
      type_line = scryfallCardData.type_line;
      break;
    case 'meld':
      // meld only appeared in Eldritch Moon and probably won't ever come back.  no planeswalkers; only creatures and a single land
      art_crop = scryfallCardData.image_uris.art_crop;
      mana_cost = scryfallCardData.mana_cost;
      type_line = scryfallCardData.type_line;

      meldResult = await fetch(
        scryfallCardData.all_parts.find(
          (part) => part.component === 'meld_result'
        ).uri
      ).json();
      back_image = meldResult.image_uris.large;
      image = scryfallCardData.image_uris.large;
      break;
    case 'modal_dfc':
      art_crop = scryfallCardData.card_faces[0].image_uris.art_crop;
      back_image = scryfallCardData.card_faces[1].image_uris.large;
      image = scryfallCardData.card_faces[0].image_uris.large;
      mana_cost = `${scryfallCardData.card_faces[0].mana_cost}${scryfallCardData.card_faces[1].mana_cost}`;
      type_line = `${scryfallCardData.card_faces[0].type_line} / ${scryfallCardData.card_faces[1].type_line}`;
      break;
    case 'saga':
      // saga's have no other faces; they simply have their own layout type becuase of the fact that the art is on the right side of the card rather than the top of the card.  all sagas printed so far (through Kaldheim) have only 3 or 4 chapters
      art_crop = scryfallCardData.image_uris.art_crop;
      image = scryfallCardData.image_uris.large;
      mana_cost = scryfallCardData.mana_cost;
      type_line = scryfallCardData.type_line;
      break;
    case 'split':
      // split cards are always instants and/or sorceries
      art_crop = scryfallCardData.image_uris.art_crop;
      image = scryfallCardData.image_uris.large;
      mana_cost = `${scryfallCardData.card_faces[0].mana_cost}${scryfallCardData.card_faces[1].mana_cost}`;
      type_line = `${scryfallCardData.card_faces[0].type_line} / ${scryfallCardData.card_faces[1].type_line}`;
      break;
    case 'transform':
      art_crop = scryfallCardData.card_faces[0].image_uris.art_crop;
      back_image = scryfallCardData.card_faces[1].image_uris.large;
      image = scryfallCardData.card_faces[0].image_uris.large;
      mana_cost = scryfallCardData.card_faces[0].mana_cost;
      type_line = `${scryfallCardData.card_faces[0].type_line} / ${scryfallCardData.card_faces[1].type_line}`;
      break;
    default:
      art_crop = scryfallCardData.image_uris.art_crop;
      image = scryfallCardData.image_uris.large;
      mana_cost = scryfallCardData.mana_cost;
      type_line = scryfallCardData.type_line;
  }

  return {
    art_crop,
    back_image,
    cmc: scryfallCardData.cmc,
    collector_number: scryfallCardData.collector_number,
    color_identity: scryfallCardData.color_identity,
    image,
    keywords: scryfallCardData.keywords,
    mana_cost,
    mtgo_id: scryfallCardData.mtgo_id,
    name: scryfallCardData.name,
    oracle_id: scryfallCardData.oracle_id,
    scryfall_id: scryfallCardData.id,
    set: scryfallCardData.set,
    set_name: scryfallCardData.set_name,
    tcgplayer_id: scryfallCardData.tcgplayer_id,
    type_line
  };
}
