import React from 'react';

function ProfilePic(props) {

    const {image, firstName, lastName, showUploader} = props;

    return (
        <div id='profile-pic-component'>

            <img
                src={ image }
                alt={ `${ firstName } ${ lastName }` }
                onClick={ showUploader }
            />

        </div>
    );
}

export default ProfilePic;
