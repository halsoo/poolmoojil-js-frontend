import { combineReducers } from 'redux';
import authReducer from './auth';
import cookieReducer from './cookie';
import cartReducer from './cart';
import orderReducer from './order';
import adminReducer from './admin';

const allReducers = combineReducers({
    logged: authReducer,
    cookie: cookieReducer,
    cart: cartReducer,
    order: orderReducer,
    admin: adminReducer,
});

export default allReducers;
