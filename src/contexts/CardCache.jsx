import React, { createContext } from 'react';

import useRequest from '../hooks/request-hook';

export const CardCacheContext = createContext({
  addCardsToCache: () => null,
  scryfallCardDataCache: { current: null }
});

export function CardCacheProvider({ children }) {
  const { sendRequest } = useRequest();
  const scryfallCardDataCache = React.useRef(Object.create(null));

  const addCardsToCache = React.useCallback(
    async (scryfall_ids) => {
      const newCards = [];

      for (const scryfall_id of scryfall_ids) {
        if (!scryfallCardDataCache.current[scryfall_id]) {
          newCards.push({ id: scryfall_id });
        }
      }

      // according to scryfall api documentation, "A maximum of 75 card references may be submitted per request."
      const numberOfScryfallRequests = Math.ceil(newCards.length / 75);
      const scryfallRequestArrays = [];

      for (
        let requestNumber = 0;
        requestNumber < numberOfScryfallRequests;
        requestNumber++
      ) {
        scryfallRequestArrays.push(newCards.splice(0, 75));
      }

      for (let request of scryfallRequestArrays) {
        await sendRequest({
          body: {
            identifiers: request
          },
          callback: async (data) => {
            for (const card of data.data) {
              scryfallCardDataCache.current[card.id] = await cacheScryfallData(
                card
              );
            }
          },
          url: 'https://api.scryfall.com/cards/collection'
        });
      }
    },
    [sendRequest]
  );

  return (
    <CardCacheContext.Provider
      value={{
        addCardsToCache,
        scryfallCardDataCache
      }}
    >
      {children}
    </CardCacheContext.Provider>
  );
}
