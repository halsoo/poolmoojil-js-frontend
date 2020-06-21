import {
    loginAPI,
    logoutAPI,
    signupAPI,
    postCartIn,
    postCartOut,
    postCartClear,
    getCartCookieAPI,
} from '../util/api';

export const login = () => {
    return {
        type: 'LOGIN',
    };
};

export const loginFail = (error) => {
    return {
        type: 'LOGIN_FAIL',
        error: error,
    };
};

export const logout = () => {
    return {
        type: 'LOGOUT',
    };
};

export const logoutFail = (error) => {
    return {
        type: 'LOGOUT_FAIL',
        error: error,
    };
};

export const signup = () => {
    return {
        type: 'SIGNUP',
    };
};

export const signupFail = (error) => {
    return {
        type: 'SIGNUP_FAIL',
        error: error,
    };
};

export const loginTry = (loginInfo) => async (dispatch) => {
    try {
        const res = await loginAPI(loginInfo);
        dispatch(login());
    } catch (error) {
        dispatch(loginFail(error));
    }
};

export const loginCookie = () => (dispatch) => {
    dispatch(login());
};

export const logoutTry = () => async (dispatch) => {
    try {
        const res = await logoutAPI();
        dispatch(logout());
    } catch (error) {
        console.log(error);
        dispatch(logoutFail(error));
    }
};

export const signupTry = (signupInfo) => async (dispatch) => {
    try {
        const res = await signupAPI(signupInfo);
        if (res.status === 201) {
            dispatch(signup());
        } else {
            dispatch(signupFail(res.status));
        }
    } catch (error) {
        console.log(error);
        dispatch(signupFail(error));
    }
};

export const setCookie = (cookie) => {
    return {
        type: 'SET_COOKIE',
        cookie: cookie,
    };
};

export const noneCookie = () => {
    return {
        type: 'NONE_COOKIE',
    };
};

export const cartInTry = (cartInInfo) => async (dispatch) => {
    try {
        const res = await postCartIn(cartInInfo);
        if (res.status === 200) {
            dispatch(cartIn(cartInInfo));
        }
    } catch (error) {
        console.log(error);
    }
};

export const cartIn = ({ id, category, quantity }) => {
    return {
        type: 'CART_IN',
        id: id,
        category: category,
        quantity: quantity,
    };
};

export const cartOutTry = ({ id }) => async (dispatch) => {
    try {
        const res = await postCartOut({ id: id });
        if (res.status === 200) {
            dispatch(cartOut({ id }));
        }
    } catch (error) {
        console.log(error);
    }
};

export const cartOut = ({ id }) => {
    return {
        type: 'CART_OUT',
        id: id,
    };
};

export const TryGetCartCookie = () => async (dispatch) => {
    try {
        const res = await getCartCookieAPI();
        //console.log(res);
        if (res.status === 200) {
            dispatch(getCartCookie(res.data));
        }
    } catch (error) {
        console.log(error);
    }
};

export const getCartCookie = (cart) => {
    return {
        type: 'CART_COOKIE',
        cart: cart,
    };
};

export const TryCartClear = () => async (dispatch) => {
    try {
        const res = await postCartClear();
        //console.log(res);
        if (res.status === 200) {
            dispatch(cartClear());
        }
    } catch (error) {
        console.log(error);
    }
};

export const cartClear = () => {
    return {
        type: 'CART_CLEAR',
    };
};

export const orderIn = (orderNum) => {
    return {
        type: 'ORDER_IN',
        orderNum: orderNum,
    };
};

export const orderOut = () => {
    return {
        type: 'ORDER_OUT',
    };
};

export const packageHistoryIn = (id) => {
    return {
        type: 'PACKAGE_HISTORY_IN',
        packageID: id,
    };
};

export const packageHistoryOut = () => {
    return {
        type: 'PACKAGE_HISTORY_OUT',
    };
};

export const packageSubscIn = (id) => {
    return {
        type: 'PACKAGE_SUBSC_IN',
        packageSubscID: id,
    };
};

export const packageSubscOut = () => {
    return {
        type: 'PACKAGE_SUBSC_OUT',
    };
};

export const gatheringHistoryIn = (id) => {
    return {
        type: 'GATHERING_HISTORY_IN',
        gatheringID: id,
    };
};

export const gatheringHistoryOut = () => {
    return {
        type: 'GATHERING_HISTORY_OUT',
    };
};

export const setAdmin = (cookie) => {
    return {
        type: 'SET_ADMIN',
        cookie: cookie,
    };
};

export const noneAdmin = () => {
    return {
        type: 'NONE_ADMIN',
    };
};
