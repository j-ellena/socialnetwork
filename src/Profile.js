import React, { Component } from 'react';
import ProfilePic from './ProfilePic';
import axios from './axios';

class Profile extends Component {

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

        axios.post('/bio', {bio : this.state.bio})
            .then(() => {
                this.props.setBio(this.state.bio);
                this.props.toggleShowBio();
            })
            .catch((err) =>
                this.setState({
                    error: err.response.data.error
                })
            );
    }

    handleBio() {
        if (!this.props.showBio) {
            if (!this.props.bio) {
                return (
                    <p onClick={this.props.toggleShowBio}>
                Click to add your bio
                    </p>
                );
            } else {
                return (<div>
                    <p> {this.props.bio} </p>
                    <p onClick={this.props.toggleShowBio}>
                        Edit your bio
                    </p>
                </div>);
            }
        }
    }

    render() {

        // const {  } = this.props;

        return (
            <div id='profile-component'>

                {
                    (this.state.error)
                        ? <div id='error-message'>
                            ERROR: {this.state.error}
                        </div>
                        : null
                }

                <ProfilePic
                    image={ this.props.image }
                    firstName={ this.props.firstName }
                    lastName={ this.props.lastName }
                    showUploader={ this.props.showUploader }
                />

                <h1>Profile</h1>

                <h6>
                    {this.props.firstName} {this.props.lastName}
                </h6>

                {this.handleBio()}

                {
                    (this.props.showBio)
                        ? ( <form onSubmit={this.handleSubmit}>
                            <textarea
                                onChange={this.handleChange}
                                name='bio'
                                cols='25'
                                rows='10'
                                defaultValue={this.props.bio}
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

export default Profile;
