import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveList} from './actions';
import OthersList from './OthersList';

const mapStateToProps = state => {
    const props = {
        friends: [],
        wannabes: [],
        penders: []
    };

    if (state.list) {
        state.list.map(
            (user) => {
                if (user.status === 2) props.friends.push(user);
                else if (user.status === 1) {
                    if (user.id === user.sender_id) props.wannabes.push(user);
                    else if (user.id === user.receiver_id) props.penders.push(user);
                }
            }
        );
    }

    return props;
};

class Friends extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.props.dispatch(receiveList());
    }

    render() {

        const { friends, wannabes, penders } = this.props;

        if (!friends && !wannabes && !penders) {
            return null;
        }

        return (
            <div id='friends-component'>

                {
                    friends &&
                        <OthersList
                            title=       'Friends'
                            users=       { friends }
                            messageText= 'No friends to show :('
                        />
                }

                {
                    wannabes &&
                        <OthersList
                            title=       'Wannabes'
                            users=       { wannabes }
                            messageText= 'No received friend requests'
                        />
                }

                {
                    penders &&
                        <OthersList
                            title=       'Penders'
                            users=       { penders }
                            messageText= 'No sent friend requests'
                        />
                }

            </div>
        );
    }
}

export default connect(mapStateToProps)(Friends);
