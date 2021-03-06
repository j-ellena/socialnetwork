import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Logo from './Logo';
import Registration from './Registration';
import Login from './Login';

function Welcome() {
    return (
        <div id='welcome-component'>

            <Logo />

            <br></br>
            <h1>Welcome to Diablo II LOD fan club</h1>
            <br></br>

            <HashRouter>
                <div>

                    <Route
                        exact path='/'
                        component={ Login }
                    />

                    <Route
                        exact path='/Registration'
                        component={ Registration }
                    />

                </div>
            </HashRouter>

        </div>
    );
}

export default Welcome;
