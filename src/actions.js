import axios from './axios';

export async function receiveList() {
    const { data } = await axios.get('/list');
    return {
        type: 'RECEIVE_LIST',
        list: data.list
    };
}
