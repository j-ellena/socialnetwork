import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { postFriendship} from './actions';

const mapStateToProps = state => {
    return {state};
};


class OthersList extends Component {

    constructor(props) {
        super(props);

        this.handleList = this.handleList.bind(this);
        this.handleButton = this.handleButton.bind(this);

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

                            { this.handleButton(user) }

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

    handleButton(user) {

        let buttonText = '';
        if (user.status == 2) {
            buttonText = 'End friendship :(';
        } else if (user.id == user.receiver_id) {
            buttonText = 'Cancel friend request :|';
        } else {
            buttonText = 'Accept friendship :)';
        }

        return (
            <button
                onClick={ () => this.handleClick(user) }
            >
                { buttonText }
            </button>
        );
    }

    handleClick(user) {
        this.props.dispatch(postFriendship(user));
    }

    render() {

        const { users, messageText } = this.props;

        if (!users) {
            return null;
        }

        return (
            <div id='list-component'>

                {
                    this.handleList(
                        users,
                        messageText)
                }

            </div>
        );
    }
}

export default connect(mapStateToProps)(OthersList);
