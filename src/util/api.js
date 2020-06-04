import axios from 'axios';
import addressAPIKey from './key';

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

export async function getUserCookie() {
    const res = await methods.get('users/getbycookie');
    return res;
}

export async function checkDuplicateUserAPI(userID) {
    const res = await methods.get('users/getuser/' + userID);
    return res;
}

export async function checkDuplicateEmailAPI(email) {
    const res = await methods.get('users/getemail/' + email);
    return res;
}

export async function logoutAPI() {
    const res = await methods.post('users/logout');
    return res;
}

export async function getGatheringByID(ID) {
    const res = await methods.get('gathering/getid/' + ID);
    return res;
}

export async function getUpcomingGathering() {
    const res = await methods.get('gathering/upcoming/');
    return res;
}

export async function getGatherings(query) {
    const res = await methods.post('gathering/', query);
    return res;
}

export async function getGatheringsCalendar() {
    const res = await methods.get('gathering//threemonths');
    return res;
}

export async function getPackageByID(ID) {
    const res = await methods.get('package/getid/' + ID);
    return res;
}

export async function getPackageMonthly() {
    const res = await methods.get('package/getmonthly');
    return res;
}

export async function getPackages(query) {
    const res = await methods.post('package/', query);
    return res;
}

export async function getBooks(query) {
    const res = await methods.post('book/', query);
    return res;
}

export async function getBookByID(ID) {
    const res = await methods.get('book/getid/' + ID);
    return res;
}

export async function getBookCurated(query) {
    const res = await methods.post('book/getcurated', query);
    return res;
}

export async function getBookSelected(query) {
    const res = await methods.post('book/getselected', query);
    return res;
}

export async function getGoods(query) {
    const res = await methods.post('good/', query);
    return res;
}

export async function getGoodByID(ID) {
    const res = await methods.get('good/getid/' + ID);
    return res;
}

export async function getNotices(query) {
    const res = await methods.post('notice/', query);
    return res;
}

export async function getNoticeByID(ID) {
    const res = await methods.get('notice/getid/' + ID);
    return res;
}

export function getAddressAPI(query, page) {
    const res = axios.get(
        `http://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${addressAPIKey}&currentPage=${page}&countPerPage=5&keyword=${query}&resultType=json`,
    );

    return res;
}
