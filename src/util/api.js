import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'development' ? '/api' : '/api';

const methods = {
    get: async function (endpoint) {
        const options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                withCredentials: true,
            },
        };

        const res = await axios.get(`${baseUrl}/${endpoint}`, options);

        return res;
    },

    post: async function (
        endpoint,
        body = null,
        options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                withCredentials: 'include',
            },
        },
    ) {
        const res = await axios.post(`${baseUrl}/${endpoint}`, body, options);

        return res;
    },
};

export async function getPlaces() {
    const res = await methods.get('places');
    return res;
}

export async function deletePlace(id) {
    const res = await methods.get('places/delete/' + id);
    return res;
}

export async function getPlace(id) {
    const res = await methods.get('places/getplace/' + id);
    return res;
}

export async function createPlace(info) {
    const res = await methods.post('places/create', info);
    return res;
}

export async function editPlace(info) {
    const res = await methods.post('places/edit', info);
    return res;
}

export async function getAboutTexts() {
    const res = await methods.get('aboutTexts');
    return res;
}

export async function deleteText(id) {
    const res = await methods.get('aboutTexts/delete/' + id);
    return res;
}

export async function getText(id) {
    const res = await methods.get('aboutTexts/gettext/' + id);
    return res;
}

export async function createText(info) {
    const res = await methods.post('aboutTexts/create', info);
    return res;
}

export async function editText(info) {
    const res = await methods.post('aboutTexts/edit', info);
    return res;
}

export async function loginAPI(loginInfo) {
    const res = await methods.post('users/login', loginInfo);
    return res;
}

export async function signupAPI(signupInfo) {
    const res = await methods.post('users/register', signupInfo);
    return res;
}

export async function updateAPI(updateInfo) {
    const res = await methods.post('users/update', updateInfo);
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
    const res = await methods.get('gathering/threemonths');
    return res;
}

export async function changeIsOver(id) {
    const res = await methods.get('gathering/changeisover/' + id);
    return res;
}

export async function createGathering(info) {
    const res = await methods.post('gathering/create', info);
    return res;
}

export async function editGathering(info) {
    const res = await methods.post('gathering/edit', info);
    return res;
}

export async function deleteGathering(id) {
    const res = await methods.get('gathering/delete/' + id);
    return res;
}

export async function getGatheringPeople(query) {
    const res = await methods.post('gathering/getpeople', query);
    return res;
}

export async function updateShowUp(id, status) {
    const res = await methods.post('gathering/updateshowup', { id: id, status: status });
    return res;
}

export async function getGatheringHistories(query) {
    const res = await methods.post('gathering/gethistories', query);
    return res;
}

export async function getGatheringHistoriesByUser(query) {
    const res = await methods.post('gathering/gethistoriesbyuser', query);
    return res;
}

export async function createGatheringHistory(info) {
    const res = await methods.post('gathering/createhistory', info);
    return res;
}

export async function cancelGatheringHistory(id) {
    const res = await methods.get('gathering/cancelhistory/' + id);
    return res;
}

export async function getGatheringHistoryByOrderNum(orderNum) {
    const res = await methods.post('gathering/gethistorybyordernum', { orderNum: orderNum });
    return res;
}

export async function createPackage(info) {
    const res = await methods.post('package/create', info);
    return res;
}

export async function editPackage(info) {
    const res = await methods.post('package/edit', info);
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

export async function changeOutOfStock(id) {
    const res = await methods.get('package/changeoutofstock/' + id);
    return res;
}

export async function deletePackage(id) {
    const res = await methods.get('package/delete/' + id);
    return res;
}

export async function createPackageHistory(info) {
    const res = await methods.post('package/createhistory', info);
    return res;
}

export async function cancelPackageHistory(id) {
    const res = await methods.get('package/cancelhistory/' + id);
    return res;
}

export async function getPackageHistories(info) {
    const res = await methods.post('package/gethistories', info);
    return res;
}

export async function getPackageHistoriesByUser(query) {
    const res = await methods.post('package/gethistoriesbyuser', query);
    return res;
}

export async function getPackageHistoryByOrderNum(orderNum) {
    const res = await methods.post('package/gethistorybyordernum', { orderNum: orderNum });
    return res;
}

export async function getPackageHistoryByID(id) {
    const res = await methods.post('package/gethistorybyid', { id: id });
    return res;
}

export async function changeTransactionStatus(id, status) {
    const res = await methods.post('package/changetransactionstatus', { id: id, status: status });
    return res;
}

export async function editTitle(id, title) {
    const res = await methods.post('package/updatepackage', { id: id, title: title });
    return res;
}

export async function createPackageSubsc(info) {
    const res = await methods.post('package/createsubsc', info);
    return res;
}

export async function getPackageSubscs(info) {
    const res = await methods.post('package/getsubscs', info);
    return res;
}

export async function getPackageSubscByID(id) {
    const res = await methods.post('package/getsubscbyid', { id: id });
    return res;
}

export async function getPackageSubscByOrderNum(orderNum) {
    const res = await methods.post('package/getsubscbyordernum', { orderNum: orderNum });
    return res;
}

export async function changeSubscStatus(id, status) {
    const res = await methods.post('package/changesubscstatus', { id: id, status: status });
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

export async function createBook(info) {
    const res = await methods.post('book/create', info);
    return res;
}

export async function editBook(info) {
    const res = await methods.post('book/edit', info);
    return res;
}

export async function deleteBook(id) {
    const res = await methods.get('book/delete/' + id);
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

export async function createGood(info) {
    const res = await methods.post('good/create', info);
    return res;
}

export async function editGood(info) {
    const res = await methods.post('good/edit', info);
    return res;
}

export async function deleteGood(id) {
    const res = await methods.get('good/delete/' + id);
    return res;
}

export async function postCartIn(cart) {
    const res = await methods.post('users/cartin', cart);
    return res;
}

export async function postCartOut(query) {
    const res = await methods.post('users/cartout', query);
    return res;
}

export async function postCartClear() {
    const res = await methods.post('users/cartclear');
    return res;
}

export async function getCartCookieAPI(query) {
    const res = await methods.get('users/getcartcookie');
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

export async function createNotice(info) {
    const res = await methods.post('notice/create', info);
    return res;
}

export async function editNotice(info) {
    const res = await methods.post('notice/edit', info);
    return res;
}

export async function deleteNotice(id) {
    const res = await methods.get('notice/delete/' + id);
    return res;
}

export async function createOrderHistory(info) {
    const res = await methods.post('orderhistory/create', info);
    return res;
}

export async function getOrderHistories(query) {
    const res = await methods.post('orderhistory/', query);
    return res;
}

export async function getOrderHistoriesByUser(query) {
    const res = await methods.post('orderhistory/gethistoriesbyuser', query);
    return res;
}

export async function getOrderHistoryByOrderNum(orderNum) {
    const res = await methods.post('orderhistory/getbyordernum', { orderNum: orderNum });
    return res;
}

export async function changeOrderStatus(id, status) {
    const res = await methods.post('orderHistory/changetransactionstatus', {
        id: id,
        status: status,
    });
    return res;
}

export async function cancelOrder(orderNum) {
    const res = await methods.get('orderhistory/cancelorder/' + orderNum);
    return res;
}

export async function getAddressAPI(query, page) {
    const q = {
        query: query,
        page: page,
    };
    const res = await methods.post('getaddress/', q);
    return res;
}

export async function uploadImage(data) {
    const res = await methods.post('/uploadimage', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            withCredentials: 'include',
        },
    });

    return res;
}
