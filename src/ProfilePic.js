import React from 'react';

function ProfilePic({ image, firstName, lastName, showUploader }) {

    return (
        <div id='profile-pic-component'>

            <img id='profile-pic-img'
                src={image}
                alt={`${firstName} ${lastName}`}
                onClick={showUploader}
            />

        </div>
    );
}

export default ProfilePic;
