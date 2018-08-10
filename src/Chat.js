import React, { Component } from 'react';
import { connect } from 'react-redux';
import { emitNewMessage } from './socket';

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
                <div className='chat-messages'
                    ref={ elem => (this.elem = elem) }>
                    {
                        messages.map(
                            message => (
                                <div
                                    className='chat-message'
                                    key={ message.date }>
                                    <img src={ message.user.image }/>
                                    <div className='chat-info'>
                                        <h6>{ message.text }</h6>
                                        <p>{ message.user.first_name } { message.user.last_name } on { new Date(message.date).toLocaleString("en-GB") }</p>
                                    </div>
                                </div>
                            )

                        )
                    }
                </div>
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
        this.elem.scrollTop = this.elem.scrollHeight;
        console.log('this.elem.scrollTop', this.elem.scrollTop);
    }

    render() {

        const { chatMessages } = this.props;

        return (
            <div id='chat-component'>

                {
                    (this.state.error)
                        ? <div className='error-message'>
                              ERROR: { this.state.error }
                        </div>
                        : null
                }


                {
                    (chatMessages) &&
                        this.handleList(
                            chatMessages,
                            'No chat messages to show, be the first to start a conversation!'
                        )
                }


                <br></br>

                <form
                    className='flex-row'
                    onSubmit={ this.handleSubmit }>
                    <textarea
                        onChange={ this.handleChange }
                        name='chatMessage'
                        cols='50'
                        rows='2'
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
