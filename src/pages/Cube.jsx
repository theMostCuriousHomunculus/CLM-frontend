import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const Cube = () => {

    const cubeId = useParams().cubeId;
    const authentication = useContext(AuthenticationContext);
    const { loading, errorMessage, sendRequest, clearError } = useRequest();

    const [activeComponent, setActiveComponent] = useState('mainboard');
    const [creator, setCreator] = useState({});
    const [description, setDescription] = useState('');
    const [mainboard, setMainBoard] = useState([]);
    const [modules, setModules] = useState([]);
    const [name, setName] = useState('');
    const [rotations, setRotations] = useState([]);
    const [sideboard, setSideboard] = useState([]);

    useEffect(() => {
        const fetchCube = async function () {
            try {
                const cubeData = await sendRequest('http://localhost:5000/api/cube/' + cubeId, 'GET', null, {});
                setDescription(cubeData.description);
                setMainBoard(cubeData.mainboard);
                setModules(cubeData.modules);
                setName(cubeData.name);
                setRotations(cubeData.rotations);
                setSideboard(cubeData.sideboard);
                const creatorData = await sendRequest('http://localhost:5000/api/account/' + cubeData.creator, 'GET', null, {});
                setCreator(creatorData);
            } catch (error) {
                console.log('Error: ' + error.message);
            }
        };
        fetchCube();
    }, [cubeId, sendRequest]);

    function changeComponent (event) {
        setActiveComponent(event.target.value);
    }

    return (
        <div>
            {creator.avatar &&
                <div className="circle-avatar-container">
                    <img alt="avatar" className="avatar" src={creator.avatar} />
                </div>
            }
            {creator.name && <h2>Creator: <Link to={`/account/${creator._id}`}>{creator.name}</Link></h2>}
            <h2>{name}</h2>
            <p>{description}</p>
            <select onChange={changeComponent}>
                <option value="mainboard">Mainboard</option>
                <option value="sidebaord">Sideboard</option>
                {
                    modules.map(function (module) {
                        return <option key={module._id} value={module._id}>{module.name}</option>
                    })
                }
                {
                    rotations.map(function (rotation) {
                        return <option key={rotation._id} value={rotation._id}>{rotation.name}</option>
                    })
                }
            </select>
        </div>
    );
}

export default Cube;