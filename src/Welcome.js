import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import Logo from './Logo';
import Registration from './Registration';
import Login from "./Login";

function Welcome() {
    return (
        <div id='welcome-component'>

            <Logo />

            <h1>Welcome to Jellena virtual network!</h1>

            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/Login" component={Login} />
                    <h6>If you have already registered,
                     please <Link to="/Login">log in!</Link></h6>
                </div>
            </HashRouter>

        </div>
    );
}

export default Welcome;
