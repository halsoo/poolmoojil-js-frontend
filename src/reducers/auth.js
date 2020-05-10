const authReducer = (state = { status: false, error: null }, action) => {
    switch (action.type) {
        case 'LOGIN': {
            return { status: true, error: null };
        }

        case 'LOGOUT': {
            return { status: false, error: null };
        }

        case 'SIGNUP': {
            return { status: true, error: null };
        }

        case 'LOGIN_FAIL': {
            return { status: false, error: action.error };
        }

        case 'LOGOUT_FAIL': {
            return { status: state.status, error: action.error };
        }

        case 'SIGNUP_FAIL': {
            return { status: state.status, error: action.error };
        }

        default:
            return state;
    }
};

export default authReducer;
