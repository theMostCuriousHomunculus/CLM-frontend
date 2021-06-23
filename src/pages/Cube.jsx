import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import { createClient } from 'graphql-ws';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
import CurveView from '../components/Cube Page/CurveView';
import EditCardModal from '../components/Cube Page/EditCardModal';
import ListView from '../components/Cube Page/ListView';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import TableView from '../components/Cube Page/TableView';
import { desiredCubeInfo } from '../requests/GraphQL/cube-requests';
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
      name: null
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
    activeComponentCards: [],
    activeComponentID: 'mainboard',
    activeComponentName: 'Mainboard',
    activeComponentSize: null,
    filter: '',
    filteredCards: [],
    view: 'Curve'
  });
  const editable = cube.creator._id === authentication.userId;
  const [selectedCard, setSelectedCard] = React.useState({});

  React.useEffect(() => {
    async function initialize () {
      await sendRequest({
        callback: (data) => {
          setCube(data);
          setDisplay(prevState => ({
            ...prevState,
            activeComponentCards: [...data.mainboard],
            filteredCards: [...data.mainboard]
          }));
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

  const addCard = React.useCallback(async function ({
    back_image,
    chapters,
    cmc,
    color_identity,
    image,
    keywords,
    loyalty,
    mana_cost,
    mtgo_id,
    name,
    oracle_id,
    power,
    printing,
    purchase_link,
    toughness,
    type_line
  }) {
    await sendRequest({
      headers: { CubeID: cubeID },
      operation: 'addCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  componentID: "${display.activeComponentID}",
                  ${back_image ? 'back_image: "' + back_image + '",' : ''}
                  ${Number.isInteger(chapters) ? 'chapters: ' + chapters + ',' : ''}
                  ${Number.isInteger(cmc) ? 'cmc: ' + cmc + ',' : ''}
                  color_identity: [${color_identity.map(ci => '"' + ci + '"')}],
                  image: "${image}",
                  keywords: [${keywords.map(kw => '"' + kw + '"')}],
                  ${Number.isInteger(loyalty) ? 'loyalty: ' + loyalty + ',' : ''}
                  mana_cost: "${mana_cost}",
                  ${Number.isInteger(mtgo_id) ? 'mtgo_id: ' + mtgo_id + ',' : ''}
                  name: "${name}",
                  oracle_id: "${oracle_id}",
                  ${Number.isInteger(power) ? 'power: ' + power + ',' : ''}
                  printing: "${printing}",
                  purchase_link: "${purchase_link}",
                  ${Number.isInteger(toughness) ? 'toughness: ' + toughness + ',' : ''},
                  type_line: "${type_line}"
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

  return (
    loading ?
      <LoadingSpinner /> :
      <React.Fragment>
        <EditCardModal card={selectedCard} clear={() => setSelectedCard({})} editable={editable} editCard={editCard} />

        <CubeInfo creator={cube.creator} description={cube.description} name={cube.name} />

        <ComponentInfo
          display={display}
          editable={editable}
          mainboard={cube.mainboard}
          modules={cube.modules}
          rotations={cube.rotations}
          setDisplay={setDisplay}
          sideboard={cube.sideboard}
        />

        {editable &&
          <MUIPaper style={{ padding: '0 8px' }}>
            <ScryfallRequest
              buttonText="Add it!"
              labelText={`Add a card to ${display.activeComponentName}`}
              onSubmit={addCard}
            />
          </MUIPaper>
        }
        {display.view === 'Curve' && <CurveView cards={display.filteredCards} setSelectedCard={setSelectedCard} />}
        {display.view === 'List' && <ListView cards={display.filteredCards} editCard={editCard} />}
        {display.view === 'Table' && <TableView cards={display.filteredCards} setSelectedCard={setSelectedCard} />}

      </React.Fragment>
  );
};