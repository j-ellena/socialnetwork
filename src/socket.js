import * as io from 'socket.io-client';
import {
    onlineUsers,
    userJoined,
    userLeft
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

    }
}
