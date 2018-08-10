import React, { Component } from 'react';
import { connect } from 'react-redux';
import { emitNewMessage } from './socket';
import * as ReactDOM from 'react-dom';

const mapStateToProps = state => {
    const props = {
        chatMessages: [],
    };
    props.chatMessages = state.messages;
    return props;
};

class Chat extends Component {

    constructor() {
        super();
        this.state = {
            chatMessage: null,
            error: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleList = this.handleList.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            chatMessage: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.chatMessage) {
            emitNewMessage(this.state.chatMessage);
            this.setState({
                chatMessage: null
            });
            this.textArea.value = '';
        } else {
            this.setState({
                error: '...not sending empty message!'
            });
        }
    }

    handleList(messages, emptyNotification) {
        if (messages.length) {
            if (messages.length > 10) messages.shift();
            return (
                messages.map(
                    message => (
                        <div key={ message.date }>
                            <img src={ message.user.image }/>
                            <p>{ message.user.first_name } { message.user.last_name }</p>
                            <p>{ message.text }</p>
                            <p>{ new Date(message.date).toLocaleString("en-GB") }</p>
                        </div>
                    )

                )
            );
        } else {
            return (
                <p>
                    { emptyNotification }
                </p>
            );
        }
    }
    componentDidUpdate() {
        const maxScrollTop = this.elem.scrollHeight - this.elem.clientHeight;
        this.elem.scrollTop =
        maxScrollTop > 0
            ? maxScrollTop
            : 0;
    }

    render() {

        const { chatMessages } = this.props;

        return (
            <div id='chat-component'>

                <h1>Chat</h1>

                {
                    (this.state.error)
                        ? <div className='error-message'>
                              ERROR: { this.state.error }
                        </div>
                        : null
                }

                <div ref={elem => (this.elem = elem)}>
                    {
                        (chatMessages) &&
                        this.handleList(
                            chatMessages,
                            'No chat messages to show, be the first to start one!'
                        )
                    }
                </div>

                <form onSubmit={ this.handleSubmit }>
                    <textarea
                        onChange={ this.handleChange }
                        name='chatMessage'
                        ref={textArea => (this.textArea = textArea)}
                    >
                    </textarea>
                    <button type='submit'>
                        Send message
                    </button>
                </form>

            </div>
        );
    }
}

export default connect(mapStateToProps)(Chat);
