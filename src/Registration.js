import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';

class Registration extends Component {

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

        axios.post('/registration', this.state)
            .then(() => location.replace('/'))
            .catch((err) =>
                this.setState({
                    error: err.response.data.error
                })
            );
    }

    render() {
        return (
            <div id='registration-component'>

                {
                    (this.state.error)
                        ? <div className='error-message'>
                              ERROR: { this.state.error }
                        </div>
                        : null
                }

                <h1>Please register:</h1>
                <br></br>

                <form onSubmit={ this.handleSubmit }>
                    <div className='flex-row'>
                        <div className='flex-col'>
                            <input
                                onChange={ this.handleChange }
                                name='firstName'
                                placeholder='First name'
                                type='text'
                            />
                            <input
                                onChange={ this.handleChange }
                                name='lastName'
                                placeholder='Last name'
                                type='text'
                            />
                        </div>
                        <div className='flex-col'>
                            <input
                                onChange={ this.handleChange }
                                name='email'
                                placeholder='Email'
                                type='email'
                            />
                            <input
                                onChange={ this.handleChange }
                                name='password'
                                placeholder='Password'
                                type='password'
                            />
                        </div>
                    </div>
                    <button type='submit'>
                        Submit
                    </button>
                </form>

                <h6>If you have already registered,
                 please <Link className='link' to='/'>log in</Link></h6>

            </div>
        );
    }
}

export default Registration;
