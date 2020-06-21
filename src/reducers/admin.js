const adminReducer = (state = { admin: undefined }, action) => {
    switch (action.type) {
        case 'SET_ADMIN': {
            return { logged: true, cookie: action.cookie };
        }

        case 'NONE_ADMIN': {
            return { logged: false, cookie: null };
        }

        default:
            return state;
    }
};

export default adminReducer;
