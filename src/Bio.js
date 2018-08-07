import React, { Component } from 'react';
import axios from './axios';

class Bio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        axios.post('/bio', { bio: this.state.bio })
            .then(() => {
                this.props.setBio(this.state.bio);
                this.props.toggleBioFlag();
            })
            .catch((err) =>
                this.setState({
                    error: err.response.data.error
                })
            );
    }

    handleBio() {
        if (!this.props.bioFlag) {
            if (!this.props.bio) {
                return (
                    <p onClick={ this.props.toggleBioFlag }>
                        Click to add your bio
                    </p>
                );
            } else {
                return (
                    <div>
                        <p>
                            { this.props.bio }
                        </p>
                        <p onClick={ this.props.toggleBioFlag }>
                            Edit your bio
                        </p>
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <div id='bio-component'>

                { this.handleBio() }

                {
                    (this.props.bioFlag)
                        ? (
                            <form onSubmit={ this.handleSubmit }>
                                <textarea
                                    onChange={ this.handleChange }
                                    name='bio'
                                    cols='25'
                                    rows='10'
                                    defaultValue={ this.props.bio }
                                >
                                </textarea>
                                <button type='submit'>
                                    Save bio
                                </button>
                            </form>
                        )
                        : null
                }

            </div>
        );
    }
}


export default Bio;
