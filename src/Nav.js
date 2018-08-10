import React from 'react';
import Logo from './Logo';

function Nav() {

    return (
        <div id='nav-component'>

            <Logo />

            <a href='/'>
                <button>
                    My profile
                </button>
            </a>

            <a href='/logout'>
                <button>
                    Logout
                </button>
            </a>

            <a href='/friends'>
                <button>
                    Friends
                </button>
            </a>

            <a href='/online'>
                <button>
                    Online Users
                </button>
            </a>

            <a href='/chat'>
                <button>
                    Chat
                </button>
            </a>

        </div>
    );
}

export default Nav;
