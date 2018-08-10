import * as io from 'socket.io-client';
import {
    onlineUsers,
    userJoined,
    userLeft,
    chatMessages,
    chatMessage
} from './actions';

let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();

        socket.on('onlineUsers',
            users => store.dispatch(onlineUsers(users)));

        socket.on('userJoined',
            user => store.dispatch(userJoined(user)));

        socket.on('userLeft',
            user => store.dispatch(userLeft(user)));

        socket.on('chatMessages',
            messages => store.dispatch(chatMessages(messages)));

        socket.on('chatMessage',
            message => store.dispatch(chatMessage(message)));

    }
}

export function emitNewMessage(message) {
    socket.emit('newMessage', message);
}
