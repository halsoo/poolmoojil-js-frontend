import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    setCookie,
    noneCookie,
    loginCookie,
    logoutTry,
    TryGetCartCookie,
    cartClear,
    setAdmin,
    noneAdmin,
} from './actions';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import Nav from './Components/Nav';
import Main from './Components/Main';
import About from './Components/About';
import Gathering from './Components/Gathering/Gathering';
import GatheringItem from './Components/Gathering/GatheringItem';
import GatheringOneTime from './Components/Gathering/GatheringOneTime';
import GatheringOneYear from './Components/Gathering/GatheringOneYear';
import RecentGatheringHistory from './Components/Gathering/RecentGatheringHistory';
import Package from './Components/Package/Package';
import PackageItem from './Components/Package/PackageItem';
import PackageOneTime from './Components/Package/PackageOneTime';
import PackageSixMonths from './Components/Package/PackageSixMonths';
import RecentPackageHistory from './Components/Package/RecentPackageHistory';
import RecentPackageSubsc from './Components/Package/RecentPackageSubsc';
import Store from './Components/Store/Store';
import BookItem from './Components/Store/BookItem';
import Good from './Components/Store/Good';
import GoodItem from './Components/Store/GoodItem';
import Cart from './Components/Store/Cart';
import Purchase from './Components/Store/Purchase';
import RecentOrder from './Components/Store/RecentOrder';
import Notice from './Components/Notice';
import Login from './Components/Login';
import MyPage from './Components/MyPage';
import Signup from './Components/Signup';
import CartIcon from './Components/shared/CartIcon';
import Footer from './Components/Footer';

import AdminNav from './Components/Nav/AdminNav';
import AdminMain from './Components/Main/AdminMain';
import AdminAboutIndex from './Components/About/AdminIndex';
import AdminPlaces from './Components/About/AdminPlaces';
import AdminPlacesEdit from './Components/About/AdminPlacesEdit';
import AdminPlacesAdd from './Components/About/AdminPlacesAdd';
import AdminTexts from './Components/About/AdminTexts';
import AdminTextsEdit from './Components/About/AdminTextsEdit';
import AdminTextsAdd from './Components/About/AdminTextsAdd';
import AdminGatheringIndex from './Components/Gathering/AdminGatheringIndex';
import AdminGatheringEdit from './Components/Gathering/AdminGatheringEdit';
import AdminGatheringAdd from './Components/Gathering/AdminGatheringAdd';
import AdminGatheringHistory from './Components/Gathering/AdminGatheringHistory';
import AdminGatheringHistoryItem from './Components/Gathering/AdminGatheringHistoryItem';
import AdminGatheringPeople from './Components/Gathering/AdminGatheringPeople';
import AdminPackageIndex from './Components/Package/AdminPackageIndex';
import AdminPackageEdit from './Components/Package/AdminPackageEdit';
import AdminPackageAdd from './Components/Package/AdminPackageAdd';
import AdminPackageHistory from './Components/Package/AdminPackageHistory';
import AdminPackageHistoryItem from './Components/Package/AdminPackageHistoryItem';
import AdminPackageSubsc from './Components/Package/AdminPackageSubsc';
import AdminPackageSubscItem from './Components/Package/AdminPackageSubscItem';
import AdminStoreIndex from './Components/Store/AdminStoreIndex';
import AdminStoreBook from './Components/Store/AdminStoreBook';
import AdminStoreBookEdit from './Components/Store/AdminStoreBookEdit';
import AdminStoreBookAdd from './Components/Store/AdminStoreBookAdd';
import AdminStoreGood from './Components/Store/AdminStoreGood';
import AdminStoreGoodEdit from './Components/Store/AdminStoreGoodEdit';
import AdminStoreGoodAdd from './Components/Store/AdminStoreGoodAdd';
import AdminStoreOrder from './Components/Store/AdminStoreOrder';
import AdminStoreOrderItem from './Components/Store/AdminStoreOrderItem';
import AdminNoticeIndex from './Components/Notice/AdminNoticeIndex';
import AdminNoticeAdd from './Components/Notice/AdminNoticeAdd';
import AdminNoticeEdit from './Components/Notice/AdminNoticeEdit';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: undefined,
            cookie: undefined,
            logged: undefined,
        };
    }

    static getDerivedStateFromProps(nProps, pState) {
        const cookie = nProps.cookies.get('access_token');
        const admin = nProps.cookies.get('admin_token');

        if (cookie && cookie !== pState.cookie && pState.cookie === undefined) {
            let adminBoolean = false;
            nProps.setCookie(cookie);
            nProps.loginCookie();
            nProps.TryGetCartCookie();
            if (admin && admin !== pState.admin && pState.admin === undefined) {
                adminBoolean = true;
                nProps.setAdmin(admin);
            }
            return { cookie: cookie, logged: true, admin: adminBoolean ? admin : undefined };
        } else if (!cookie && pState.cookie !== undefined) {
            let adminBoolean = false;
            nProps.noneCookie();
            nProps.cartClear();
            if (!admin && pState.admin !== undefined) {
                nProps.noneAdmin();
                adminBoolean = true;
            }
            return {
                cookie: undefined,
                logged: false,
                admin: adminBoolean ? undefined : pState.admin,
            };
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="App relative w-full">
                {!this.props.admin.logged ? (
                    <Router>
                        <Route path="/" component={Nav} />
                        <Route path="/store" component={CartIcon} />
                        <div className="lg:grid lg:grid-cols-12 lg:gap-2">
                            <div
                                className="lg:mt-3 lg:mb-3 
                                        sm:mx-auto sm:px-10 sm:mt-8
                                        sm:flex sm:w-full 
                                        lg:col-start-3 lg:col-end-11"
                            >
                                <Switch>
                                    <Route exact path="/" component={Main} />
                                    <Route exact path="/main" to="/" />
                                    <Route exact path="/about" component={About} />
                                    <Route exact path="/gathering" component={Gathering} />
                                    <Route exact path="/gathering/:id" component={GatheringItem} />
                                    <Route
                                        exact
                                        path="/gathering/onetime/:id"
                                        component={GatheringOneTime}
                                    />
                                    <Route
                                        exact
                                        path="/gathering/oneyear/:id"
                                        component={GatheringOneYear}
                                    />
                                    <Route
                                        exact
                                        path="/recent-gathering-history"
                                        component={RecentGatheringHistory}
                                    />
                                    <Route exact path="/package" component={Package} />
                                    <Route exact path="/package/:id" component={PackageItem} />
                                    <Route
                                        exact
                                        path="/package/onetime/:id"
                                        component={PackageOneTime}
                                    />
                                    <Route
                                        exact
                                        path="/package/sixmonths/:id"
                                        component={PackageSixMonths}
                                    />
                                    <Route
                                        exact
                                        path="/recent-package-history"
                                        component={RecentPackageHistory}
                                    />
                                    <Route
                                        exact
                                        path="/recent-package-subsc"
                                        component={RecentPackageSubsc}
                                    />
                                    <Route exact path="/store" component={Store} />
                                    <Route exact path="/store/good" component={Good} />
                                    <Route exact path="/store/book/:id" component={BookItem} />
                                    <Route exact path="/store/good/:id" component={GoodItem} />
                                    <Route exact path="/cart" component={Cart} />
                                    <Route exact path="/purchase" component={Purchase} />
                                    <Route exact path="/recent-order" component={RecentOrder} />
                                    <Route exact path="/notice" component={Notice} />
                                    <Route exact path="/mypage" component={MyPage} />
                                    <Route exact path="/login" component={Login} />
                                    <Route exact path="/register" component={Signup} />
                                </Switch>
                            </div>
                        </div>
                    </Router>
                ) : (
                    <Router>
                        <Route path="/" component={AdminNav} />
                        <div className="lg:grid lg:grid-cols-12 lg:gap-2">
                            <div
                                className="lg:mt-3 lg:mb-3 
                                        sm:mx-auto sm:px-10 sm:mt-8
                                        sm:flex sm:w-full 
                                        lg:col-start-3 lg:col-end-11"
                            >
                                <Switch>
                                    <Route exact path="/" component={AdminMain} />
                                    <Route exact path="/main" to="/" />
                                    <Route exact path="/about" component={AdminAboutIndex} />
                                    <Route exact path="/about/places" component={AdminPlaces} />
                                    <Route
                                        exact
                                        path="/about/places/edit/:id"
                                        component={AdminPlacesEdit}
                                    />
                                    <Route
                                        exact
                                        path="/about/places/add"
                                        component={AdminPlacesAdd}
                                    />
                                    <Route exact path="/about/texts" component={AdminTexts} />
                                    <Route
                                        exact
                                        path="/about/texts/edit/:id"
                                        component={AdminTextsEdit}
                                    />
                                    <Route
                                        exact
                                        path="/about/texts/add"
                                        component={AdminTextsAdd}
                                    />
                                    <Route
                                        exact
                                        path="/gathering"
                                        component={AdminGatheringIndex}
                                    />
                                    <Route
                                        exact
                                        path="/gathering/edit/:id"
                                        component={AdminGatheringEdit}
                                    />
                                    <Route
                                        exact
                                        path="/gathering/add"
                                        component={AdminGatheringAdd}
                                    />
                                    <Route
                                        exact
                                        path="/gathering/history"
                                        component={AdminGatheringHistory}
                                    />
                                    <Route
                                        exact
                                        path="/gathering/history/:orderNum"
                                        component={AdminGatheringHistoryItem}
                                    />
                                    <Route
                                        exact
                                        path="/gathering/people/:id"
                                        component={AdminGatheringPeople}
                                    />
                                    <Route exact path="/package" component={AdminPackageIndex} />
                                    <Route
                                        exact
                                        path="/package/edit/:id"
                                        component={AdminPackageEdit}
                                    />
                                    <Route exact path="/package/add" component={AdminPackageAdd} />
                                    <Route
                                        exact
                                        path="/package/history"
                                        component={AdminPackageHistory}
                                    />
                                    <Route
                                        exact
                                        path="/package/history/:id"
                                        component={AdminPackageHistoryItem}
                                    />
                                    <Route
                                        exact
                                        path="/package/subsc"
                                        component={AdminPackageSubsc}
                                    />
                                    <Route
                                        exact
                                        path="/package/subsc/:id"
                                        component={AdminPackageSubscItem}
                                    />
                                    <Route exact path="/store" component={AdminStoreIndex} />
                                    <Route exact path="/store/book" component={AdminStoreBook} />
                                    <Route
                                        exact
                                        path="/store/book/edit/:id"
                                        component={AdminStoreBookEdit}
                                    />
                                    <Route
                                        exact
                                        path="/store/book/add"
                                        component={AdminStoreBookAdd}
                                    />
                                    <Route exact path="/store/good" component={AdminStoreGood} />
                                    <Route
                                        exact
                                        path="/store/good/edit/:id"
                                        component={AdminStoreGoodEdit}
                                    />
                                    <Route
                                        exact
                                        path="/store/good/add"
                                        component={AdminStoreGoodAdd}
                                    />
                                    <Route exact path="/store/order" component={AdminStoreOrder} />
                                    <Route
                                        exact
                                        path="/store/order/:orderNum"
                                        component={AdminStoreOrderItem}
                                    />
                                    <Route exact path="/notice" component={AdminNoticeIndex} />
                                    <Route exact path="/notice/add" component={AdminNoticeAdd} />
                                    <Route
                                        exact
                                        path="/notice/edit/:id"
                                        component={AdminNoticeEdit}
                                    />
                                </Switch>
                            </div>
                        </div>
                    </Router>
                )}
                <Footer />
            </div>
        );
    }
}
const MapStateToProps = (state) => ({
    cookie: state.cookie,
    logged: state.logged,
    cart: state.cart,
    admin: state.admin,
});

const MapDispatchToProps = {
    setCookie,
    noneCookie,
    loginCookie,
    logoutTry,
    TryGetCartCookie,
    cartClear,
    setAdmin,
    noneAdmin,
};

export default connect(MapStateToProps, MapDispatchToProps)(withCookies(App));
