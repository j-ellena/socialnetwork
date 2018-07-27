import React, { Component } from 'react';
import axios from './axios';
import Logo from './Logo';
import ProfilePic from './ProfilePic';
import Uploader from './Uploader';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
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
        if (!this.state.id) {
            return (
                <div>...loading...</div>
            );
        }
        return (
            <div id='app'>

                <Logo />

                <ProfilePic
                    image={this.state.image}
                    firstName={this.state.first_name}
                    lastName={this.state.last_name}
                    showUploader={this.showUploader}
                />

                {
                    this.state.uploaderIsVisible
                &&
                <Uploader
                    setImage={this.setImage}
                    hideUploader={this.hideUploader}
                />
                }

            </div>
        );
    }
}

export default App;
