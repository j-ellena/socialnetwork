import axios from './axios';

export async function receiveList() {
    const { data } = await axios.get('/list');
    return {
        type: 'RECEIVE_LIST',
        list: data.list
    };
}

export async function postFriendship(user) {
    const { data } = await axios.post(`/friendship/${user.id}`, user);
    return {
        type: 'POST_FRIENDSHIP',
        id: user.id,
        status: data.status,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id
    };
}
