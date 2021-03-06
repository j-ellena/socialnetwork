import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from './axios';
import Profile from './Profile';
import OthersProfiles from './OthersProfiles';
import Friends from './Friends';
import OnlineUsers from './OnlineUsers';
import Chat from './Chat';
import Nav from './Nav';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bioFlag: false,
            error: null
        };

        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.toggleBioFlag = this.toggleBioFlag.bind(this);
    }

    showUploader() {
        this.setState({
            uploaderFlag : true
        });
    }

    hideUploader() {
        this.setState({
            uploaderFlag : false
        });
    }

    setImage(image) {
        this.setState({
            uploaderFlag : false,
            image: image
        });
    }

    setBio(bio) {
        this.setState({
            bio: bio
        });
    }

    toggleBioFlag() {
        this.setState({
            bioFlag : !this.state.bioFlag
        });
    }

    componentDidMount() {
        axios.get('/user')
            .then(( { data } ) => this.setState(data))
            .catch((err) =>
                this.setState({
                    error : err.response.data.error
                })
            );
    }

    render() {

        // const {  } = this.state;

        if (!this.state.id) {
            return (
                <h1 className='message-div'>
                    ...loading...
                </h1>
            );
        }

        return (
            <div id='app'>

                <Nav />

                <BrowserRouter>
                    <div id='router-div'>
                        <Route
                            exact path='/'
                            render=
                                {
                                    () => (
                                        <Profile
                                            firstName=         { this.state.first_name }
                                            lastName=          { this.state.last_name }
                                            image=             { this.state.image }
                                            bio=               { this.state.bio }
                                            setImage=          { this.setImage }
                                            setBio=            { this.setBio }
                                            bioFlag=           { this.state.bioFlag }
                                            uploaderFlag=      { this.state.uploaderFlag }
                                            toggleBioFlag=     { this.toggleBioFlag }
                                            showUploader=      { this.showUploader }
                                            hideUploader=      { this.hideUploader }
                                        />
                                    )
                                }
                        />
                        <Route
                            exact path='/user/:id'
                            component={ OthersProfiles }
                        />
                        <Route
                            exact path='/friends'
                            component={ Friends }
                        />
                        <Route
                            exact path='/online'
                            component={ OnlineUsers }
                        />
                        <Route
                            exact path='/chat'
                            component={ Chat }
                        />
                    </div>
                </BrowserRouter>

            </div>
        );
    }
}

export default App;
