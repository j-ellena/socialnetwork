import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    const props = {
        onlineUsers: []
    };
    props.onlineUsers = state.users;
    return props;
};

class OnlineUsers extends Component {

    constructor(props) {
        super(props);

        this.handleList = this.handleList.bind(this);
    }

    handleList(users, emptyNotification) {
        if (users.length > 1) {
            return (
                <div id='online-users-div'>
                    {
                        users.map(
                            user => (
                                <div key={user.id}>

                                    <Link to={`/user/${user.id}`} >
                                        <img src={user.image} />
                                    </Link>

                                    <p>
                                        <Link className='link' to={`/user/${user.id}`} >
                                            {user.first_name} {user.last_name}
                                        </Link>
                                    </p>

                                </div>
                            )
                        )
                    }
                </div>
            );
        } else {
            return (
                <div className='message-div'>
                    <h1>
                        { emptyNotification }
                    </h1>
                </div>
            );
        }
    }

    render() {

        const { onlineUsers } = this.props;

        if (!onlineUsers) {
            return null;
        }

        return (
            <div id='online-users-component'>

                {
                    this.handleList(
                        onlineUsers,
                        `Other players are on their single missions right now,
                        check back later to join the session!`
                    )

                }
            </div>
        );
    }
}

export default connect(mapStateToProps)(OnlineUsers);
