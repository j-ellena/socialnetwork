import React, { Component } from 'react';
import ProfilePic from './ProfilePic';
import Uploader from './Uploader';
import Bio from './Bio';

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

    }

    render() {

        // const {  } = this.props;

        return (
            <div id='profile-component'>

                {
                    (this.state.error)
                        ? <div className='error-message'>
                            ERROR: { this.state.error }
                        </div>
                        : null
                }

                {
                    this.props.uploaderFlag
                    &&
                    <Uploader
                        setImage=     { this.props.setImage }
                        hideUploader= { this.props.hideUploader }
                    />
                }

                <ProfilePic
                    image=        { this.props.image }
                    firstName=    { this.props.firstName }
                    lastName=     { this.props.lastName }
                    showUploader= { this.props.showUploader }
                />

                <h1>Profile</h1>

                <h6>
                    { this.props.firstName } { this.props.lastName }
                </h6>

                <Bio
                    bio=           { this.props.bio }
                    bioFlag=       { this.props.bioFlag}
                    setBio=        { this.props.setBio }
                    toggleBioFlag= { this.props.toggleBioFlag}
                />

            </div>
        );
    }
}

export default Profile;
