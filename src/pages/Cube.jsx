import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import HoverPreview from '../components/HoverPreview';
import ScryfallRequest from '../components/ScryfallRequest';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useCardSort, useCardOrganizer } from '../hooks/card-organizer-hook';
import { useRequest } from '../hooks/request-hook';

const Cube = () => {

    const cubeId = useParams().cubeId;
    const authentication = useContext(AuthenticationContext);
    const { groupAndSort } = useCardOrganizer();
    const { loading, errorMessage, sendRequest, clearError } = useRequest();

    const [activeComponent, setActiveComponent] = useState(null);
    const [creator, setCreator] = useState(null);
    const [cube, setCube] = useState(null);
    const [displayedCards, setDisplayedCards] = useState(null);
    const [filter, setFilter] = useState('');
    const [groupBy, setGroupBy] = useState(['cmc', 'color_identity', 'type_line']);
    const [preview, setPreview] = useState({
        back_image: null,
        container_display: "none",
        image: null,
        image_display: "none",
        left: 0,
        top: 0
    });
    const [sortBy, setSortBy] = useState(['color_identity', 'type_line', 'cmc', 'name']);

    useEffect(() => {
        const fetchCube = async function () {
            try {
                const cubeData = await sendRequest('http://localhost:5000/api/cube/' + cubeId, 'GET', null, {});                
                setActiveComponent({
                    cards: cubeData.mainboard,
                    _id: 'mainboard',
                    name: 'Mainboard'
                });
                setCube(cubeData);
                changeDisplayedCards(cubeData.mainboard, filter);
                const creatorData = await sendRequest('http://localhost:5000/api/account/' + cubeData.creator, 'GET', null, {});
                setCreator(creatorData);
            } catch (error) {
                console.log('Error: ' + error.message);
            }
        };
        fetchCube();
    }, [cubeId]);

    async function addCard () {

        const cardSearch = document.getElementById('card-search');
        const cardSearchResults = document.getElementById('card-search-results');
        const chosenCard = cardSearchResults.options.namedItem(cardSearch.value);
        const printing = document.getElementById('printing');
        const chosenPrinting = printing.options[printing.selectedIndex];

        try {

            const cardData = JSON.stringify({
                action: 'add_card',
                back_image: chosenPrinting.getAttribute('data-back_image'),
                color_identity: JSON.parse(chosenCard.getAttribute('data-color_identity')),
                component: activeComponent._id,
                cmc: chosenCard.getAttribute('data-cmc'),
                cube_id: cubeId,
                image: chosenPrinting.getAttribute('data-image'),
                keywords: JSON.parse(chosenCard.getAttribute('data-keywords')),
                loyalty: chosenCard.getAttribute('data-loyalty'),
                mana_cost: chosenCard.getAttribute('data-mana_cost'),
                name: chosenCard.value,
                oracle_id: chosenCard.getAttribute('data-oracle_id'),
                power: chosenCard.getAttribute('data-power'),
                printing: printing.value,
                purchase_link: chosenPrinting.getAttribute('data-purchase_link'),
                toughness: chosenCard.getAttribute('data-toughness'),
                type_line: chosenCard.getAttribute('data-type_line')
            });

            const updatedCube = await sendRequest(
                'http://localhost:5000/api/cube/',
                'PATCH',
                cardData,
                {
                    Authorization: 'Bearer ' + authentication.token,
                    'Content-Type': 'application/json'
                }
            );
            if (activeComponent._id === 'mainboard') {
                setActiveComponent({
                    cards: updatedCube.mainboard,
                    _id: 'mainboard',
                    name: 'Mainboard'
                });
                changeDisplayedCards(updatedCube.mainboard, filter);
            } else if (activeComponent._id === 'sideboard') {
                setActiveComponent({
                    cards: updatedCube.sideboard,
                    _id: 'sideboard',
                    name: 'Sideboard'
                });
                changeDisplayedCards(updatedCube.sideboard, filter);
            } else {
                let modulesAndRotations = [...updatedCube.modules, ...updatedCube.rotations];
                const component = modulesAndRotations.find(function (cmpnt) {
                    return cmpnt._id === activeComponent._id;
                });
                setActiveComponent({
                    cards: component.cards,
                    _id: component._id,
                    name: component.name
                });
                changeDisplayedCards(component.cards, filter);
            }
            setCube(updatedCube);
        } catch (error) {
            console.log({ 'Error': error.message });
        }
    }

    function changeComponent (event) {
        if (event.target.value === 'mainboard') {
            setActiveComponent({
                cards: cube.mainboard,
                _id: 'mainboard',
                name: 'Mainboard'
            });
            changeDisplayedCards(cube.mainboard, filter);
        } else if (event.target.value === 'sideboard') {
            setActiveComponent({
                cards: cube.sideboard,
                _id: 'sideboard',
                name: 'Sideboard'
            });
            changeDisplayedCards(cube.sideboard, filter);
        } else {
            let modulesAndRotations = [...cube.modules, ...cube.rotations];
            const component = modulesAndRotations.find(function (cmpnt) {
                return cmpnt._id === event.target.value;
            });
            setActiveComponent({
                cards: component.cards,
                _id: component._id,
                name: component.name
            });
            changeDisplayedCards(component.cards, filter);
        }
    }

    function changeDisplayedCards (unfilteredCards, filterText) {
        setDisplayedCards(
            groupAndSort(unfilteredCards.filter(function (card) {
                    return (
                        card.name.toLowerCase().includes(filterText.toLowerCase()) ||
                        card.type_line.toLowerCase().includes(filterText.toLowerCase())
                    );
                }),
            groupBy, sortBy)
        );
    }

    function changeFilter (event) {
        setFilter(event.target.value);
        changeDisplayedCards(activeComponent.cards, event.target.value);
    }

    function hidePreview () {
        setPreview({
            ...preview,
            back_image: null,
            container_display: "none",
            image: null,
            image_display: "none"
        });
    }

    function movePreview (event) {
        setPreview({
            ...preview,
            left: event.pageX + 10 + "px",
            top: event.pageY + 12 + "px"
        });
    }

    function showPreview (event) {
        setPreview({
            ...preview,
            back_image: event.target.getAttribute('back_image'),
            container_display: "block",
            image: event.target.getAttribute('image'),
            image_display: "inline"
        });
    }

    return (
        <div onMouseMove={movePreview}>
            <HoverPreview
                {...preview}
            />
            {creator && creator.avatar &&
                <div className="circle-avatar-container">
                    <img alt="avatar" className="avatar" src={creator.avatar} />
                </div>
            }
            {creator &&
                <h2>Creator: <Link to={`/account/${creator._id}`}>
                    {creator.name}
                </Link></h2>
            }
            {cube &&
                <h2>{cube.name}</h2>
            }
            {cube && cube.description &&
                <p>{cube.description}</p>
            }
            {cube && activeComponent && displayedCards &&
                <React.Fragment>
                    <h3>{activeComponent.name}</h3>
                    <select onChange={changeComponent}>
                        <option value="mainboard">Mainboard</option>
                        <option value="sideboard">Sideboard</option>
                        {
                            cube.modules.map(function (module) {
                                return <option key={module._id} value={module._id}>{module.name}</option>
                            })
                        }
                        {
                            cube.rotations.map(function (rotation) {
                                return <option key={rotation._id} value={rotation._id}>{rotation.name}</option>
                            })
                        }
                    </select>
                    <ScryfallRequest
                        action="http://localhost:5000/api/cube/"
                        buttonText="Add it!"
                        method="PATCH"
                        onSubmit={addCard}
                        searchPlaceholderText={`Search for a card to add to ${activeComponent.name}`}
                    />
                    <input
                        autoComplete="off"
                        onChange={changeFilter}
                        placeholder="Filter cards by keywords, name or type"
                        type="text"
                        value={filter}
                    />
                    <ul>
                        {displayedCards.map(function (group, index) {
                            return (
                                <div
                                    className={`card-container ${group.color['name']}-card-container`}
                                    key={`group-${index}`}
                                >
                                    <h3>{group.color['name'] + " " + group.cost['name'] + "CMC " + group.type['name']}</h3>
                                    {group.cards.map(function (card) {
                                        return (
                                            <li
                                                back_image={card.back_image}
                                                image={card.image}
                                                key={card._id}
                                                onMouseOut={hidePreview}
                                                onMouseOver={showPreview}
                                            >
                                                {card.name}
                                            </li>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </ul>
                </React.Fragment>
            }
        </div>
    );
}

export default Cube;