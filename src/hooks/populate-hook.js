import { useCallback, useContext } from 'react';

import { CardCacheContext } from '../contexts/card-cache-context';

export default function usePopulate() {
  const { scryfallCardDataCache } = useContext(CardCacheContext);

  const populateCachedScryfallData = useCallback(
    function (card, index, array) {
      array[index] = {
        ...scryfallCardDataCache.current[card.scryfall_id],
        _id: card._id
      };

      for (const property of ['cmc', 'color_identity', 'notes', 'type_line']) {
        if (card[property] !== null && typeof card[property] !== 'undefined') {
          array[index][property] = card[property];
        }
      }
    },
    [scryfallCardDataCache]
  );

  return { populateCachedScryfallData };
}
