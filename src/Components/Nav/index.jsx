import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Slider from '../SlideOut';

import { logoutTry } from '../../actions';

import logo from '../../img/logo.png';
import menu from '../../img/menu.png';
import close from '../../img/close.png';

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elems: [
                {
                    name: 'about',
                    display: '소개',
                    path: '/about',
                },
                {
                    name: 'gathering',
                    display: '모임',
                    path: '/gathering',
                },
                // {
                //     name: 'package',
                //     display: '꾸러미',
                //     path: '/package',
                // },
                {
                    name: 'store',
                    display: '장터',
                    path: '/store',
                },
                {
                    name: 'notice',
                    display: '공지',
                    path: '/notice',
                },
            ],
            isOpen: false,
            windowSize: {
                width: window.innderWidth,
                height: window.innerHeight,
            },
        };
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ windowSize: { width: window.innerWidth, height: window.innerHeight } });
    };

    render() {
        const elems = this.state.elems;
        return this.state.windowSize.width > 1080 ? (
            <div className="grid grid-cols-12 col-gap-2">
                <div className="col-start-3 col-end-4">
                    <Link to="/" className="">
                        <img src={logo} className="" alt="풀무질" />
                    </Link>
                </div>
                {/* NAV BAR ELEMS including login and register */}
                <div className="col-start-4 col-end-11 grid grid-cols-7 col-gap-2">
                    {/* NAV BAR ELEMS */}
                    <div className="flex flex-row col-start-1 col-end-6 justify-around">
                        {/* EACH NAV BAR ELEMS */}
                        {elems.map((elem, index) => {
                            return (
                                <div
                                    className={`h-full flex 
                                        items-center w-28
                                        ${
                                            this.props.location.pathname === elem.path
                                                ? 'bg-green-500'
                                                : 'bg-white'
                                        }`}
                                    key={index}
                                >
                                    <Link
                                        to={elem.path}
                                        className={`mx-auto text-2xl font-regular tracking-wider
                                            ${
                                                this.props.location.pathname === elem.path
                                                    ? 'text-white'
                                                    : 'text-green-500'
                                            }`}
                                    >
                                        {elem.display}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* login and register */}
                    <div
                        className="col-start-6 col-end-8
                                    flex items-center 
                                    justify-end
                                    text-xl text-right
                                    text-green-500 
                                    font-regular tracking-wider"
                    >
                        {this.props.logged.status ? (
                            <Link to="/mypage" className="">
                                나의 풀무질
                            </Link>
                        ) : (
                            <Link to="/login" className="">
                                로그인
                            </Link>
                        )}
                        {this.props.logged.status ? (
                            <button onClick={() => this.props.logoutTry()} className="ml-12">
                                로그아웃
                            </button>
                        ) : (
                            <Link to="/register" className="ml-12">
                                회원가입
                            </Link>
                        )}
                    </div>
                </div>

                {/* bottom bar */}
                <div
                    className="h-0 w-auto sm:w-full
                                col-start-1 col-end-13 
                                border-green-500 border-t-3"
                />
            </div>
        ) : (
            // small screen
            <div className="flex flex-col h-full">
                <div
                    className="grid grid-cols-3 col-gap-2
                                w-full items-center"
                >
                    <button
                        onClick={() => {
                            this.setState({ isOpen: !this.state.isOpen });
                        }}
                        className="w-20% ml-16 col-start-1 col-end-2"
                    >
                        <img src={menu} alt="menu" />
                    </button>

                    <Link to="/" className="h-auto w-2/3 col-start-2 col-end-3 mx-auto">
                        <img src={logo} className="" alt="풀무질" />
                    </Link>
                    <div className="col-start-1 col-end-4 border-t-8 border-green-500" />
                </div>

                <Slider
                    headerHeight={10}
                    header={
                        <div className="h-full grid grid-cols-3">
                            <button
                                className="h-auto col-start-1 col-end-2"
                                onClick={() => {
                                    this.setState({ isOpen: !this.state.isOpen });
                                }}
                            >
                                <img src={close} className="ml-16 w-20%" alt="close" />
                            </button>

                            {this.props.logged.status ? (
                                <Link
                                    to="/mypage"
                                    onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                                    className="m-auto text-7xl text-green-500"
                                >
                                    나의 풀무질
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                                    className="m-auto text-7xl text-green-500"
                                >
                                    로그인
                                </Link>
                            )}

                            {this.props.logged.status ? (
                                <button
                                    onClick={() => {
                                        this.setState({ isOpen: !this.state.isOpen });
                                        return this.props.logoutTry();
                                    }}
                                    className="m-auto text-7xl text-green-500"
                                >
                                    로그아웃
                                </button>
                            ) : (
                                <Link
                                    to="/register"
                                    onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                                    className="m-auto text-7xl text-green-500"
                                >
                                    회원가입
                                </Link>
                            )}
                        </div>
                    }
                    isOpen={this.state.isOpen}
                    leftToRight
                    onOutsideClick={() => this.setState({ isOpen: !this.state.isOpen })}
                    className="flex flex-col"
                >
                    {elems.map((elem, index) => {
                        return (
                            <div className="flex flex-col mt-4 items-center" key={index}>
                                <Link
                                    to={elem.path}
                                    onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                                    className="ml-24 mr-auto text-10xl text-white tracking-wider"
                                >
                                    {elem.display}
                                </Link>
                                <div className="h-0 w-90% border-t-8 border-white" />
                            </div>
                        );
                    })}
                </Slider>
            </div>
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
});

const MapDispatchToProps = { logoutTry };

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(Nav));
