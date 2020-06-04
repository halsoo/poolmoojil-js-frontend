import { combineReducers } from 'redux';
import authReducer from './auth';
import cookieReducer from './cookie';
import cartReducer from './cart';

const allReducers = combineReducers({
    logged: authReducer,
    cookie: cookieReducer,
    cart: cartReducer,
});

export default allReducers;
