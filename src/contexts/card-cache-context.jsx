import { createContext } from 'react';

export const CardCacheContext = createContext({
  addCardsToCache: () => null,
  scryfallCardDataCache: { current: null }
});
