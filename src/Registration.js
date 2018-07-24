import React, { Component } from 'react'
import axios from 'axios'

class Registration extends Component {
    constructor() {
        super()

        this.state = {
            error: null
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()

        axios.post('/registration', this.state)
            .then(resp => {
                if (resp.data.error) {
                    this.setState({
                        error: resp.data.error
                    })
                } else {
                    location.replace('/')
                }
            })
    }

    render() { 
        return (
            <div className="registration">
                <h1>Registration Yo!</h1>

                {
                    this.state.error
                        ? <div>ERROR: { this.state.error }</div>
                        : null
                }

                <form onSubmit={ this.handleSubmit }>
                    <input onChange={ this.handleChange } name="fullName" placeholder="name" type="text"/>
                    <input onChange={ this.handleChange } name="dog" placeholder="dog" type="text"/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default Registration
