import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Backdrop from './Backdrop';
import Header from './Header';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';

const MainNav = () => {
    
    const [drawerOpen, setDrawerOpen] = useState(false);

    function toggleDrawer() {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <React.Fragment>
            {drawerOpen && <Backdrop onClick={toggleDrawer} />}
            <SideDrawer show={drawerOpen} onClick={toggleDrawer}>
                <nav className='side-nav'>
                    <NavLinks />
                </nav>
            </SideDrawer>
            <Header>
                <i className='fas fa-bars' onClick={toggleDrawer}></i>
                <h1>
                    <Link to='/'>Cube Level Midnight</Link>
                </h1>
                <nav className='top-nav'>
                    <NavLinks />
                </nav>
            </Header>
        </React.Fragment>
    );
};

export default MainNav;