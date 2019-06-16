export default function(
    state = {
        list: [],
        users: [],
        messages: []
    },
    action
) {

    if (action.type === 'RECEIVE_LIST') {
        state = {
            ...state,
            list: action.list
        };

    } else if (action.type === 'POST_FRIENDSHIP') {
        state = {
            ...state,
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

    } else if (action.type === 'ONLINE_USERS') {
        state = {
            ...state,
            users: action.users
        };

    } else if (action.type === 'USER_JOINED') {
        state = {
            ...state,
            users: [...state.users, action.user]
        };

    } else if (action.type === 'USER_LEFT') {
        state = {
            ...state,
            users: state.users.filter(
                user => user.id != action.user.id
            )
        };

    } else if (action.type === 'CHAT_MESSAGES') {
        state = {
            ...state,
            messages: action.messages
        };


    } else if (action.type == 'CHAT_MESSAGE') {
        state = {
            ...state,
            messages: [...state.messages, action.message]
        };
    }

    return state;

}
