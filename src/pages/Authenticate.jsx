import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authentication-context';

const Authenticate = () => {

    const [mode, setMode] = useState('Login');
    const authentication = useContext(AuthenticationContext);
    const history = useHistory();

    function toggleMode (prevState) {
        if (prevState === 'Login') {
            setMode('Register');
        } else {
            setMode('Login');
        }
    }

    async function login (event) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/account/login',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const responseData = await response.json();

            if (response.ok) {
                authentication.login(responseData.userId, responseData.token);
                history.push('/');
            } else {
                alert(responseData.message);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async function register (event) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/account',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: document.getElementById('email').value,
                        name: document.getElementById('name').value,
                        password: document.getElementById('password').value
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const responseData = await response.json();
            
            if (response.ok) {
                authentication.login(responseData.userId, responseData.token);
                history.push('/');
            } else {
                alert(responseData.message);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    let form;

    if (mode === 'Login') {
        form = (
            <form
                action='http://localhost:5000/api/account/login'
                method='PATCH'
                onSubmit={login}
            >
                <input type="email" id="email" name="email" placeholder="Email Address"></input>
                <input type="password" id="password" name="password" placeholder="Password"></input>
                <button>Login!</button>
            </form>
        );
    } else {
        form = (
            <form
                action='http://localhost:5000/api/account'
                method='POST'
                onSubmit={register}
            >
                <input type="text" id="name" name="name" placeholder="Account Name"></input>
                <input type="email" id="email" name="email" placeholder="Email Address"></input>
                <input type="password" id="password" name="password" placeholder="Password"></input>
                <button>Register!</button>
            </form>
        );
    }

    return (
        <div>
            <h1>{mode}</h1>
            {form}
            <button onClick={() => toggleMode (mode)}>
                {mode === 'Login' ? "Don't have an account yet?  Register!" : 'Already have an account?  Login!'}
            </button>
        </div>
    );
}

export default Authenticate;