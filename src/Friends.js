import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveList} from './actions';
import OthersList from './OthersList';

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

                <h1>Friends</h1>
                {
                    friends &&
                        <OthersList
                            users=       { friends }
                            messageText= 'No friends to show :('
                        />
                }

                <br></br>

                <h1>Wannabes</h1>
                {
                    wannabes &&
                        <OthersList
                            users=       { wannabes }
                            messageText= 'No received friend requests'
                        />
                }

                <br></br>

                <h1>Penders</h1>
                {
                    penders &&
                        <OthersList
                            users=       { penders }
                            messageText= 'No sent friend requests'
                        />
                }

            </div>
        );
    }
}

export default connect(mapStateToProps)(Friends);
