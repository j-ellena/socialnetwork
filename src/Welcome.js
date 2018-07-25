import React from 'react';
import Logo from './Logo';
import Registration from './Registration';

function Welcome() {
    return (
        <div id='welcome-component'>

            <Logo />

            <h1>Welcome to Jellena virtual network!</h1>

            <Registration />

            <div>
                If you have already registered, please <a href=''>log in</a>
            </div>

        </div>
    );
}

export default Welcome;
