export default function(state = {}, action) {
    switch (action.type) {
                    case 'RECEIVE_LIST':
                        state = {
                            ...state,
                            list: action.list
                        };
    }

    return state;
}
