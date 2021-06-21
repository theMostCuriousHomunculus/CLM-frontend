import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import { createClient } from 'graphql-ws';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
import CurveView from '../components/Cube Page/CurveView';
import HoverPreview from '../components/miscellaneous/HoverPreview';
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
    view: 'Table'
  });

  React.useEffect(() => {
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
                  back_image: "${back_image}",
                  chapters: ${chapters},
                  cmc: ${cmc},
                  color_identity: [${color_identity.map(ci => '"' + ci + '"')}],
                  image: "${image}",
                  keywords: [${keywords.map(kw => '"' + kw + '"')}],
                  loyalty: ${loyalty},
                  mana_cost: "${mana_cost}",
                  mtgo_id: ${mtgo_id},
                  name: ${name},
                  oracle_id: "${oracle_id}",
                  power: ${power},
                  printing: "${printing}",
                  purchase_link: "${purchase_link}",
                  toughness: ${toughness},
                  type_line: "${type_line}"
                }
              )
            }
          `
        }
      }
    });
  }, [cubeID, display.activeComponentID, sendRequest]);

  // i think this hacky workaround was only needed because i was using redux...
  const ScryfallRequestHackyWorkAround = (props) => {
    return (
      <MUIPaper>
        <ScryfallRequest
          buttonText="Add it!"
          labelText={`Add a card to ${display.activeComponentName}`}
          onSubmit={addCard}
          {...props}
        />
      </MUIPaper>
    );
  }

  return (
    loading ?
      <LoadingSpinner /> :
      <React.Fragment>
        <CubeInfo creator={cube.creator} description={cube.description} name={cube.name} />

        <ComponentInfo cube={cube} display={display} setDisplay={setDisplay} />

        <HoverPreview marginBottom={190}>

          {authentication.userId === cube.creator._id && <ScryfallRequestHackyWorkAround />}
          {display.view === 'Curve' && <CurveView cards={display.filteredCards} />}
          {display.view === 'List' && <ListView cards={display.filteredCards} />}
          {display.view === 'Table' && <TableView cards={display.filteredCards} />}

        </HoverPreview>
      </React.Fragment>
  );
};