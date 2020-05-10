import axios from 'axios';

const baseUrl =
    process.env.NODE_ENV === 'development' ? '/api' : `https://${window.location.hostname}/api`;

const methods = {
    get: async function (endpoint, token = null) {
        const options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                withCredentials: true,
            },
        };

        const res = await axios.get(`${baseUrl}/${endpoint}`, options);

        return res;
    },

    post: async function (endpoint, body = null, token = null) {
        const options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                withCredentials: 'include',
            },
        };
        const res = await axios.post(`${baseUrl}/${endpoint}`, body, options);

        return res;
    },

    delete: async function (endpoint, body, token = null) {
        const options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                withCredentials: true,
            },
        };

        const response = await axios.delete(`${baseUrl}/${endpoint}`, { data: body }, options);
        const json = await response.json();

        if (!response.ok) {
            if (response.status === 401) throw Error('unauthorized');
            throw Error(json.message);
        }

        return json;
    },
};

export async function loginAPI(loginInfo) {
    const res = await methods.post('users/login', loginInfo);
    return res;
}

export async function signupAPI(signupInfo) {
    const res = await methods.post('users/register', signupInfo);
    return res;
}

export async function checkDuplicateAPI(userID) {
    const res = await methods.get('users/' + userID);
    return res;
}

export async function logoutAPI() {
    const res = await methods.post('users/logout');
    return res;
}

export async function getBooksAPI(token) {
    const res = await methods.get('books', token);
    return res;
}
