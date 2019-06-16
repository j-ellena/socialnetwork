import React, { Component } from 'react';
import axios from './axios';
import FriendButton from './FriendButton';

class OthersProfiles extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

    }

    componentDidMount() {
        axios.get(`/user/${this.props.match.params.id}.json`)
            .then( ({ data }) => {
                (data.redirect)
                    ? this.props.history.push('/')
                    : this.setState(data);
            })
            .catch((err) =>
                this.setState({
                    error: err.response.data.error
                })
            );
    }

    render() {

        // const { } = this. state;

        return (
            <div id='others-profiles-component'>

                <img src={ this.state.image } />
                <h1>{ this.state.first_name } { this.state.last_name }</h1>
                <p>{ this.state.bio }</p>

                <FriendButton
                    id={ this.props.match.params.id }
                />

            </div>
        );
    }
}

export default OthersProfiles;
