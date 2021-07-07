import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import { createClient } from 'graphql-ws';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
// import CurveView from '../components/Cube Page/CurveView';
import EditCardModal from '../components/Cube Page/EditCardModal';
// import ListView from '../components/Cube Page/ListView';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import TableView from '../components/Cube Page/TableView';
import { AuthenticationContext } from '../contexts/authentication-context';

export default function Cube () {

  const authentication = React.useContext(AuthenticationContext);
  const cubeID = useParams().cubeId;
  const { loading, sendRequest } = useRequest();
  // the user does not directly manipulate this state; they send requests to the server and then the server updates the cube state
  const [cube, setCube] = React.useState({
    _id: cubeID,
    creator: {
      _id: null,
      avatar: null,
      name: '...'
    },
    description: '',
    mainboard: [],
    modules: [],
    name: '',
    rotations: [],
    sideboard: []
  });
  // this state is directly manipulated by the user; all presentational
  const [display, setDisplay] = React.useState({
    activeComponentID: 'mainboard',
    filter: '',
    // view: 'Table'
  });
  const editable = cube.creator._id === authentication.userId;
  const [selectedCard, setSelectedCard] = React.useState();

  const filterCards = React.useCallback((cards, text) => cards.filter(card => {
    const wordArray = text.split(" ");
    return (
      wordArray.every(word => (
        card.keywords.map(keyword => keyword.toLowerCase()).includes(word.toLowerCase()) ||
        card.name.toLowerCase().includes(word.toLowerCase()) ||
        card.type_line.toLowerCase().includes(word.toLowerCase())
      ))
    );
  }), []);

  React.useEffect(() => {

    const desiredCardInfo = `
      _id
      back_image
      cmc
      collector_number
      color_identity
      image
      keywords
      mana_cost
      mtgo_id
      name
      oracle_id
      scryfall_id
      set
      set_name
      tcgplayer_id
      tokens {
        name
        scryfall_id
      }
      type_line
    `;

    const desiredCubeInfo = `
      _id
      creator {
        _id
        avatar
        name
      }
      description
      mainboard {
        ${desiredCardInfo}
      }
      modules {
        _id
        cards {
          ${desiredCardInfo}
        }
        name
      }
      name
      rotations {
        _id
        cards {
          ${desiredCardInfo}
        }
        name
        size
      }
      sideboard {
        ${desiredCardInfo}
      }
    `;

    async function initialize () {
      await sendRequest({
        callback: (data) => {
          setCube(data);
        },
        headers: { CubeID: cubeID },
        load: true,
        operation: 'fetchCubeByID',
        get body() {
          return {
            query: `
              query {
                ${this.operation} {
                  ${desiredCubeInfo}
                }
              }
            `
          }
        }
      });
    }

    initialize();

    const client = createClient({
      connectionParams: {
        authToken: authentication.token,
        cubeID
      },
      url: process.env.REACT_APP_GRAPHQL_WS_URL
    });

    async function subscribe () {
      function onNext(update) {
        setCube(update.data.subscribeCube);
      }

      await new Promise((resolve, reject) => {
        client.subscribe({
          query: `subscription {
            subscribeCube {
              ${desiredCubeInfo}
            }
          }`
        },
        {
          complete: resolve,
          error: reject,
          next: onNext
        });
      });
    }

    subscribe(result => console.log(result), error => console.log(error));

    return client.dispose;
  }, [authentication.token, cubeID, sendRequest]);

  const addCardToCube = React.useCallback(async function ({
    back_image,
    cmc,
    collector_number,
    color_identity,
    image,
    keywords,
    mana_cost,
    mtgo_id,
    name,
    oracle_id,
    scryfall_id,
    set,
    set_name,
    tcgplayer_id,
    tokens,
    type_line
  }) {
    await sendRequest({
      headers: { CubeID: cubeID },
      operation: 'addCardToCube',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  componentID: "${display.activeComponentID}",
                  card: {
                    ${back_image ? 'back_image: "' + back_image + '",' : ''}
                    cmc: ${cmc},
                    collector_number: ${collector_number},
                    color_identity: [${color_identity.map(ci => '"' + ci + '"')}],
                    image: "${image}",
                    keywords: [${keywords.map(kw => '"' + kw + '"')}],
                    mana_cost: "${mana_cost}",
                    ${Number.isInteger(mtgo_id) ? 'mtgo_id: ' + mtgo_id + ',' : ''}
                    name: "${name}",
                    oracle_id: "${oracle_id}",
                    scryfall_id: "${scryfall_id}",
                    set: "${set}",
                    set_name: "${set_name}",
                    ${Number.isInteger(tcgplayer_id) ? 'tcgplayer_id: ' + tcgplayer_id + ',' : ''}
                    tokens: [${tokens.map(token => '{\nname: "' + token.name + '",\nscryfall_id: "' + token.scryfall_id + '"\n}')}],
                    type_line: "${type_line}"
                  }
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [cubeID, display.activeComponentID, sendRequest]);

  const deleteCard = React.useCallback(async function (cardID, destinationID) {
    await sendRequest({
      headers: { CubeID: cubeID },
      operation: 'deleteCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  ${destinationID ? 'destinationID: "' + destinationID + '",' : ''}
                  originID: "${display.activeComponentID}"
                }
              )
            }
          `
        }
      }
    });
  }, [cubeID, display.activeComponentID, sendRequest]);

  const editCard = React.useCallback(async function (changes) {
    await sendRequest({
      headers: { CubeID: cubeID },
      operation: 'editCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  componentID: "${display.activeComponentID}",
                  ${changes}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [cubeID, display.activeComponentID, sendRequest]);

  const component = {};

  if (display.activeComponentID === 'sideboard') {
    component.displayedCards = filterCards(cube.sideboard, display.filter);
    component.name = 'Sideboard';
  } else if (cube.modules.find(module => module._id === display.activeComponentID)) {
    const module = cube.modules.find(mdl => mdl._id === display.activeComponentID);
    component.displayedCards = filterCards(module.cards, display.filter);
    component.name = module.name;
  } else if (cube.rotations.find(rotation => rotation._id === display.activeComponentID)) {
    const rotation = cube.rotations.find(rtn => rtn._id === display.activeComponentID);
    component.displayedCards = filterCards(rotation.cards, display.filter);
    component.maxSize = rotation.cards.length;
    component.name = rotation.name;
    component.size = rotation.size;
  } else {
    component.displayedCards = filterCards(cube.mainboard, display.filter);
    component.name = 'Mainboard';
  }

  return (
    loading ?
      <LoadingSpinner /> :
      <React.Fragment>
        {selectedCard &&
          <EditCardModal
            activeComponentID={display.activeComponentID}
            activeComponentName={component.name}
            card={selectedCard}
            clear={() => setSelectedCard()}
            deleteCard={deleteCard}
            editable={editable}
            editCard={editCard}
            modules={cube.modules.map(module => ({ _id: module._id, name: module.name }))}
            rotations={cube.rotations.map(rotation => ({ _id: rotation._id, name: rotation.name }))}
          />
        }

        <CubeInfo creator={cube.creator} description={cube.description} editable={editable} name={cube.name} />

        <ComponentInfo
          component={component}
          display={display}
          editable={editable}
          modules={cube.modules.map(module => ({ _id: module._id, name: module.name }))}
          rotations={cube.rotations.map(rotation => ({ _id: rotation._id, name: rotation.name, size: rotation.size }))}
          setDisplay={setDisplay}
        />

        {editable &&
          <MUIPaper style={{ padding: '0 4px', position: 'sticky', top: 4 }}>
            <ScryfallRequest
              buttonText="Add it!"
              labelText={`Add a card to ${component.name}`}
              onSubmit={addCardToCube}
            />
          </MUIPaper>
        }
        {/*display.view === 'Curve' && <CurveView cards={component.displayedCards} setSelectedCard={setSelectedCard} />*/}
        {/*display.view === 'List' && <ListView cards={component.displayedCards} editCard={editCard} />*/}
        <TableView cards={component.displayedCards} setSelectedCard={setSelectedCard} />

      </React.Fragment>
  );
};