import { login, logout } from '../actions';

export default () => (next) => (action) => {
    if (action.type === LOGIN || action.type === SIGNUP) {
        localStorage.setItem('token', action.token);
    } else if (action.type === LOGOUT) {
        localStorage.removeItem('token');
    }
    next(action);
};
