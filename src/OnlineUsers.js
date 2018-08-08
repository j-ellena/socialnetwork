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

    handleList(users, messageText) {
        if (users.length > 0) {
            return (
                users.map(
                    user => (
                        <div key={user.id}>

                            <Link to={`/user/${user.id}`} >
                                <img src={user.image} />
                            </Link>

                            <Link to={`/user/${user.id}`} >
                                <p>
                                    {user.first_name} {user.last_name}
                                </p>
                            </Link>

                        </div>
                    )
                )
            );
        } else {
            return (
                <p>
                    { messageText }
                </p>
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

                <h1>Online users</h1>

                {
                    this.handleList(
                        onlineUsers,
                        'There is nobody else online...'
                    )

                }
            </div>
        );
    }
}

export default connect(mapStateToProps)(OnlineUsers);
