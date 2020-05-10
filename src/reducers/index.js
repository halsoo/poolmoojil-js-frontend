import { combineReducers } from 'redux';
import authReducer from './auth';
import cookieReducer from './cookie';

const allReducers = combineReducers({
    logged: authReducer,
    cookie: cookieReducer,
});

export default allReducers;
