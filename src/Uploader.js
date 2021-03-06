import React, { Component } from 'react';
import axios from './axios';

class Uploader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageFile: null,
            error: null
        };

        this.getSelected = this.getSelected.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    getSelected(e) {
        this.setState({
            imageFile: e.target.files[0]
        });
    }

    uploadImage(e) {
        e.preventDefault();

        let formData = new FormData();
        if (this.state.imageFile === null) {
            this.setState({
                error: 'Please select an image file!'
            });
        } else {
            formData.append('file', this.state.imageFile);
            axios.post('/image', formData)
                .then((response) => this.props.setImage(response.data))
                .catch((err) => {
                    this.setState({
                        error: err.response.data.error});
                });
        }
    }

    handlePropagation(e) {
        e.stopPropagation();
    }

    render() {
        return (
            <div
                id='uploader-component'
                onClick={ this.props.hideUploader }
            >

                <div
                    id='uploader-popup'
                    onClick={ this.handlePropagation }
                >

                    <div
                        id='uploader-x'
                        onClick={ this.props.hideUploader }
                    >
                        X
                    </div>

                    {
                        (this.state.error)
                            ? <div className='error-message'>
                                ERROR: { this.state.error }
                            </div>
                            : null
                    }

                    <form
                        id='uploader-div'
                        onSubmit={ this.uploadImage }
                    >
                        <p>Want to change your profile image?</p>
                        <br></br>

                        <label
                            id='label-file'
                            htmlFor='file'
                        >
                                Select image
                        </label>
                        <button type='submit'>
                            Upload image
                        </button>
                        <input
                            id='file'
                            type='file'
                            onChange={ this.getSelected }
                        />
                    </form>

                </div>
            </div>
        );
    }
}


export default Uploader;
