import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginTry } from '../../actions';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: undefined,
        };
    }

    login = async (event) => {
        const userID = this.state.userID ? this.state.userID : null;
        const password = this.state.password ? this.state.password : null;
        const loginInfo = {
            userID,
            password,
        };

        this.props.loginTry(loginInfo, this.props.cookie);
    };

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value });
    };

    shouldComponentUpdate(nProps, nState) {
        if (nState.userID !== this.state.userID || nState.password !== this.state.password) {
            return false;
        } else {
            return true;
        }
    }

    static getDerivedStateFromProps(nProps, pState) {
        if (nProps.logged.error) {
            return { error: '회원 정보를 찾을 수 없습니다.' };
        }
        return null;
    }

    render() {
        return this.props.logged.status ? (
            <Redirect to="/" />
        ) : (
            <div
                className="sm:mx-auto sm:w-90% sm:h-auto lg:h-plg lg:w-auto my-28 sm:p-28 lg:p-12 
                            flex flex-col justify-between border border-green-500"
            >
                <div className="flex flex-col justify-around">
                    <div
                        className={`flex flex-row justify-between sm:mb-${
                            this.state.error ? 3 : 10
                        } lg:mb-${this.state.error ? 3 : 10}`}
                    >
                        <div className={`w-50% h-auto sm:text-7xl lg:text-4xl text-green-500`}>
                            로그인
                        </div>

                        <div className="w-50% h-auto my-auto text-2xl text-green-500">
                            test ID: test1234 / test password: test1234
                        </div>
                    </div>

                    <div className="w-50% h-auto sm:mb-6 lg:mb-6 sm:text-xl lg:text-xl text-red-500">
                        {this.state.error ? this.state.error : null}
                    </div>
                </div>

                <div className="h-full flex sm:flex-col lg:flex-row justify-between">
                    <form
                        id="login"
                        className="lg:w-50% sm:h-p lg:h-full sm:mb-12 flex flex-col justify-around lg:justify-between"
                    >
                        <input
                            className="sm:h-50% lg:h-16 sm:mb-4 p-4 sm:text-6xl lg:text-2xl border border-green-500 sm:rounded-none"
                            type="text"
                            name="userID"
                            onChange={this.handleChange}
                            placeholder="아이디"
                        />
                        <input
                            className="sm:h-50% lg:h-16 p-4 sm:text-6xl lg:text-2xl border border-green-500 sm:rounded-none"
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                            placeholder="비밀번호"
                        />
                    </form>
                    <div className="h-auto sm:w-full lg:w-50% flex sm:flex-col lg:flex-row lg:justify-around">
                        <div className="flex sm:mb-12 lg:ml-6 sm:w-full lg:w-40% sm:h-48 bg-green-500 justify-center">
                            <button
                                onClick={this.login}
                                className="sm:text-6xl lg:text-4xl text-white"
                            >
                                로그인
                            </button>
                        </div>

                        <div className="lg:ml-6 sm:w-full lg:w-50% sm:h-32 lg:h-full flex sm:flex-row lg:flex-col justify-between lg:text-xl sm:text-4xl">
                            <div className="sm:w-30% lg:h-30% bg-green-500 text-white flex justify-center">
                                <Link to="/register" className="self-center">
                                    회원가입
                                </Link>
                            </div>
                            <div className="sm:w-30% lg:h-30% border border-green-500 text-green-500 flex justify-center">
                                <Link to="/findID" className="self-center">
                                    아이디 찾기
                                </Link>
                            </div>
                            <div className="sm:w-30% lg:h-30% border border-green-500 text-green-500 flex justify-center">
                                <Link to="/findPassWord" className="self-center">
                                    비밀번호 찾기
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cookie: state.cookie,
});

const MapDispatchToProps = { loginTry };

export default connect(MapStateToProps, MapDispatchToProps)(Login);
