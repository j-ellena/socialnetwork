import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from './axios';
import Logo from './Logo';
import Uploader from './Uploader';
import Profile from './Profile';

class App extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            showBio: false,
            error: null
        };

        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.toggleShowBio = this.toggleShowBio.bind(this);
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    setImage(image) {
        this.setState({
            uploaderIsVisible: false,
            image: image
        });
    }

    setBio(bio) {
        this.setState({
            bio: bio
        });
    }

    toggleShowBio() {
        this.setState({
            showBio: !this.state.showBio
        });
    }


    componentDidMount() {
        axios.get('/user')
            .then(( { data } ) => {
                this.setState(data);
            })
            .catch((err) =>
                this.setState({
                    error: err.response.data.error
                })
            );
    }

    render() {

        // const {  } = this.state;

        if (!this.state.id) {
            return (
                <div>...loading...</div>
            );
        }

        return (
            <div id='app'>

                <Logo />

                {
                    this.state.uploaderIsVisible
                    &&
                    <Uploader
                        setImage={this.setImage}
                        hideUploader={this.hideUploader}
                    />
                }

                <BrowserRouter>
                    <div>
                        <Route
                            path='/'
                            render=
                                {
                                    () => (
                                        <Profile
                                            firstName={ this.state.first_name }
                                            lastName={ this.state.last_name }
                                            image={ this.state.image }
                                            bio={ this.state.bio }
                                            showBio={ this.state.showBio }
                                            toggleShowBio={ this.toggleShowBio }
                                            setBio={ this.setBio }
                                            showUploader={ this.showUploader }
                                        />
                                    )
                                }
                        />
                    </div>
                </BrowserRouter>

            </div>
        );
    }
}

export default App;
