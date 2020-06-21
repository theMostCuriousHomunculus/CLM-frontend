import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authentication-context';

const NavLinks = () => {

    const authentication = useContext(AuthenticationContext);

    return (
        <ul className='nav-links'>
            {authentication.isLoggedIn && (
                <React.Fragment>
                    <li>
                        <button className='link' onClick={authentication.logout}>Logout</button>
                    </li>
                    <li>
                        <NavLink to={'/account/' + authentication.userId } className='link'>My Profile</NavLink>
                    </li>
                </React.Fragment>
            )}
            {!authentication.isLoggedIn && (
                <li>
                    <NavLink to='/account/authenticate' className='link'>Login</NavLink>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;