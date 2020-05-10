import { loginAPI, logoutAPI, signupAPI } from '../util/api';

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

export const signupTry = () => async (dispatch) => {
    try {
        const res = await signupAPI();
        dispatch(signup());
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