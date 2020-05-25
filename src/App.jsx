import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCookie, noneCookie, loginCookie, logoutTry } from './actions';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import Nav from './Components/Nav';
import Main from './Components/Main';
import About from './Components/About';
import Gathering from './Components/Gathering/Gathering';
import GatheringItem from './Components/Gathering/GatheringItem';
import Package from './Components/Package/Package';
import PackageItem from './Components/Package/PackageItem';
import Store from './Components/Store/Store';
import BookItem from './Components/Store/BookItem';
import Good from './Components/Store/Good';
import GoodItem from './Components/Store/GoodItem';
import Login from './Components/Login';
import MyPage from './Components/MyPage';
import Signup from './Components/Signup';
import Footer from './Components/Footer';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cookie: undefined,
            logged: undefined,
        };
    }

    static getDerivedStateFromProps(nProps, pState) {
        const cookie = nProps.cookies.get('access_token');

        if (cookie && cookie !== pState.cookie && pState.cookie === undefined) {
            nProps.setCookie(cookie);
            nProps.loginCookie();
            return { cookie: cookie, logged: true };
        } else if (!cookie && pState.cookie !== undefined) {
            nProps.noneCookie();
            return { cookie: undefined, logged: false };
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <Route path="/" component={Nav} />
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
                                <Route exact path="/package" component={Package} />
                                <Route exact path="/package/:id" component={PackageItem} />
                                <Route exact path="/store" component={Store} />
                                <Route exact path="/store/good" component={Good} />
                                <Route exact path="/store/book/:id" component={BookItem} />
                                <Route exact path="/store/good/:id" component={GoodItem} />
                                <Route exact path="/notice" component={Store} />
                                <Route exact path="/mypage" component={MyPage} />
                                <Route exact path="/login" component={Login} />
                                <Route exact path="/register" component={Signup} />
                            </Switch>
                        </div>
                    </div>
                </Router>
                <Footer />
            </div>
        );
    }
}
const MapStateToProps = (state) => ({
    cookie: state.cookie,
    logged: state.logged,
});

const MapDispatchToProps = { setCookie, noneCookie, loginCookie, logoutTry };

export default connect(MapStateToProps, MapDispatchToProps)(withCookies(App));
