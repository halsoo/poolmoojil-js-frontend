const cookieReducer = (state = { cookie: null }, action) => {
    switch (action.type) {
        case 'SET_COOKIE': {
            return { cookie: action.cookie };
        }

        case 'NONE_COOKIE': {
            return { cookie: null };
        }

        default:
            return state;
    }
};

export default cookieReducer;
