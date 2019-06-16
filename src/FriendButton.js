import React, { Component } from 'react';
import axios from './axios';

class FriendButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

        this.clickButton = this.clickButton.bind(this);

    }

    clickButton() {
        axios.post(`/friendship/${this.props.id}`, this.state)
            .then( ( { data } ) => this.setState(data))
            .catch((err) =>
                this.setState({
                    error: err.response.data.error
                })
            );
    }

    componentDidMount() {
        axios.get(`/friendship/${this.props.id}`)
            .then( ( { data } ) => this.setState(data))
            .catch((err) =>
                this.setState({
                    error: err.response.data.error
                })
            );
    }

    render() {
        return (
            <div id='friend-button-component'>

                {
                    (this.state.error)
                        ? <div className='error-message'>
                          ERROR: { this.state.error }
                        </div>
                        : null
                }

                <button onClick={ this.clickButton }>
                    { this.state.text }
                </button>

            </div>

        );
    }
}


export default FriendButton;
