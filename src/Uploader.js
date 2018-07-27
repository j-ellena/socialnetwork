import React from 'react';
import axios from './axios';

function Uploader ({setImage, hideUploader}) {
    let imageFile;

    function getSelected(e) {
        imageFile = e.target.files[0];
    }

    function uploadImage() {
        let formData = new FormData();
        // if (this.state.imageFile == '') {
        //     this.setState({
        //         error: 'Please, select a file to upload'
        //     });
        // } else {
        formData.append('file', imageFile);
        axios.post('/uploadImage', formData)
            .then((response) => {
                setImage(response.data.image);
            })
            .catch((err) => console.log(err));
    }

    function handlePropagation(e) {
        e.stopPropagation();
    }

    return (
        <div id='uploader-component' onClick={hideUploader}>

            <div id='uploader-popup' onClick={handlePropagation}>

                <h1 id='uploader-x' onClick={hideUploader}>X</h1>

                <div id='uploader-form'>
                    <p>Want to change your profile image?</p>

                    <label
                        id='label-file'
                        htmlFor='file'>
                            Select image
                    </label>

                    <input
                        id='file'
                        type='file'
                        onChange={getSelected}
                    />

                    <button
                        onClick={uploadImage}
                    >
                        Upload!
                    </button>
                </div>
            </div>
        </div>
    );
}


export default Uploader;
