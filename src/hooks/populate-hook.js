import { useCallback, useContext } from 'react';

import { CardCacheContext } from '../contexts/card-cache-context';

export default function usePopulate() {
  const { scryfallCardDataCache } = useContext(CardCacheContext);

  const populateCachedScryfallData = useCallback(
    function (card, index, array) {
      array[index] = {
        ...scryfallCardDataCache.current[card.scryfall_id],
        _id: card._id,
        notes: card.notes
      };

      for (const property of ['cmc', 'color_identity', 'type_line']) {
        if (card[property] !== null) array[index][property] = card[property];
      }
    },
    [scryfallCardDataCache]
  );

  return { populateCachedScryfallData };
}
