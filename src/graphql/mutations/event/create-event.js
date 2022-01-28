import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncCreateEvent({
  headers: { CubeID },
  queryString,
  signal,
  variables: {
    cards_per_pack,
    event_type,
    modules,
    name,
    other_players,
    packs_per_player
  }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($cards_per_pack: Int!, $event_type: EventEnum!, $modules: [String], $name: String!, $other_players: [String], $packs_per_player: Int!) {
          createEvent (
            cards_per_pack: $cards_per_pack,
            event_type: $event_type,
            modules: $modules,
            name: $name,
            other_players: $other_players,
            packs_per_player: $packs_per_player
          ) ${queryString}
        }
      `,
      variables: {
        cards_per_pack,
        event_type,
        modules,
        name,
        other_players,
        packs_per_player
      }
    },
    headers: { CubeID },
    signal
  });
}

export function syncCreateEvent({
  headers: { CubeID },
  variables: {
    cards_per_pack,
    event_type,
    modules,
    name,
    other_players,
    packs_per_player
  }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($cards_per_pack: Int!, $event_type: EventEnum!, $modules: [String], $name: String!, $other_players: [String], $packs_per_player: Int!) {
          createEvent (
            cards_per_pack: $cards_per_pack,
            event_type: $event_type,
            modules: $modules,
            name: $name,
            other_players: $other_players,
            packs_per_player: $packs_per_player
          ) {
            _id
          }
        }
      `,
      variables: {
        cards_per_pack,
        event_type,
        modules,
        name,
        other_players,
        packs_per_player
      }
    },
    headers: { CubeID }
  });
}

export default function createEvent({
  headers: { CubeID },
  queryString,
  signal,
  variables: {
    cards_per_pack,
    event_type,
    modules,
    name,
    other_players,
    packs_per_player
  }
}) {
  if (queryString) {
    return (async function () {
      return await asyncCreateEvent({
        headers: { CubeID },
        queryString,
        signal,
        variables: {
          cards_per_pack,
          event_type,
          modules,
          name,
          other_players,
          packs_per_player
        }
      });
    })();
  } else {
    syncCreateEvent({
      headers: { CubeID },
      variables: {
        cards_per_pack,
        event_type,
        modules,
        name,
        other_players,
        packs_per_player
      }
    });
  }
}
