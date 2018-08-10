import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { postFriendship} from './actions';

const mapStateToProps = state => {
    const props = {state};
    return props;
};


class OthersList extends Component {

    constructor(props) {
        super(props);

        this.handleList = this.handleList.bind(this);
        this.handleButton = this.handleButton.bind(this);

    }

    handleList(title, users, messageText) {

        if (users.length > 0) {
            return (
                <div className='list-div'>
                    <div>{ title }</div>
                    {
                        users.map(
                            user => (
                                <div
                                    className='grid-2-col'
                                    key={ user.id }
                                >
                                    <div className='grid-info'>
                                        <Link to={`/user/${user.id}`}>
                                            <img src={ user.image } />
                                        </Link>

                                        <Link className='link' to={`/user/${user.id}`}>
                                            { user.first_name } { user.last_name }
                                        </Link>
                                    </div>

                                    { this.handleButton(user) }

                                </div>
                            )
                        )
                    }
                </div>
            );
        } else {
            return (
                <div className='list-div'>{ messageText }</div>
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
                className='grid-button'
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

        const { title, users, messageText } = this.props;

        if (!users) {
            return null;
        }

        return (
            <div id='list-component'>

                {
                    this.handleList(
                        title,
                        users,
                        messageText)
                }

            </div>
        );
    }
}

export default connect(mapStateToProps)(OthersList);
