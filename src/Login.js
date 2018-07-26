import React, { Component } from 'react';
import axios from './axios';

class Login extends Component {
    constructor() {
        super();

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

        axios.post('/login', this.state)
            .then(() => {
                location.replace('/');
            })
            .catch((err) => {
                this.setState({
                    error: err.response.data.error
                });
            });
    }

    render() {
        return (
            <div id='login-component'>

                {
                    (this.state.error)
                        ? <div id='error-message'>
                              ERROR: {this.state.error}</div>
                        : null
                }

                <h1>Please log in:</h1>

                <form
                    onSubmit={this.handleSubmit}
                    id='form'
                >
                    <input
                        onChange={this.handleChange}
                        name='email'
                        placeholder='Email'
                        type='email'
                    />
                    <input
                        onChange={this.handleChange}
                        name='password'
                        placeholder='Password'
                        type='password'
                    />
                    <button type='submit'>Submit</button>
                </form>
            </div>
        );
    }
}

export default Login;
