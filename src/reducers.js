export default function(state = {}, action) {

    if (action.type === 'RECEIVE_LIST') {
        return {
            list: action.list
        };

    } else if (action.type === 'POST_FRIENDSHIP') {
        return {
            list: state.list.map(
                (user) => {
                    if (user.id == action.id) {
                        return {
                            ...user,
                            status: action.status,
                            sender_id: action.sender_id,
                            receiver_id: action.receiver_id
                        };
                    } else {
                        return user;
                    }
                })
        };

    } else if (action.type == 'ONLINE_USERS') {
        return {
            users: action.users
        };

    } else if (action.type == 'USER_JOINED') {
        return {
            users: [...state.users, action.user]
        };

    } else if (action.type == 'USER_LEFT') {
        return {
            users: state.users.filter(
                user => user.id != action.user.id
            )
        };

    } else {
        return state;
    }
}
