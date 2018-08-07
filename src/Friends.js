import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { receiveList } from './actions';

const mapStateToProps = state => {
    return {
        friends:
            state.list &&
            state.list.filter(user =>
                user.status == 2),
        wannabes:
            state.list &&
            state.list.filter(user =>
                user.status == 1 &
                user.id == user.sender_id),
        penders: state.list &&
            state.list.filter(user =>
                user.status == 1 &
                user.id == user.receiver_id)
    };
};

class Friends extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

        this.handleList = this.handleList.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(receiveList());
    }

    handleList(users, messageText) {
        if (users.length > 0) {
            return (
                users.map(
                    user => (
                        <div key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <img src={user.image} />
                            </Link>
                            <Link to={`/user/${user.id}`}>
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


    // {
    //     this.handleList(
    //         friends,
    //         'Accept friendship',
    //         'No new friend requests'
    //     )
    // }
    // }




    render() {

        const { friends, wannabes, penders } = this.props;

        if (!friends && !wannabes) {
            return null;
        }

        return (
            <div id='friends-component'>

                <h1>Friends</h1>
                <div className='list-users'>
                    {
                        this.handleList(
                            friends,
                            'No friends to show :(')
                    }
                </div>

                <br></br>

                <h1>Wannabes</h1>
                <div className='list-users'>
                    {
                        this.handleList(
                            wannabes,
                            'No received friends requests')
                    }
                </div>

                <br></br>

                <h1>Penders</h1>
                <div className='list-users'>
                    {
                        this.handleList(
                            penders,
                            'No sent friend requests')
                    }
                </div>

            </div>
        );
    }
}

export default connect(mapStateToProps)(Friends);
