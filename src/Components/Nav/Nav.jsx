import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Slider from 'react-slide-out';
import 'react-slide-out/lib/index.css';

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
                {
                    name: 'package',
                    display: '꾸러미',
                    path: '/package',
                },
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
        };
    }

    render() {
        const elems = this.state.elems;
        return (
            <div
                className="sm:flex sm:flex-col sm:h-full
                            lg:grid lg:grid-cols-12 lg:col-gap-2"
            >
                <div
                    className="lg:col-start-3 lg:col-end-4 
                                sm:grid sm:grid-cols-3 sm:col-gap-2
                                sm:w-full sm:items-center
                                "
                >
                    <button
                        onClick={() => {
                            this.setState({ isOpen: !this.state.isOpen });
                        }}
                        className="lg:hidden sm:w-16 sm:ml-16 sm:col-start-1 sm:col-end-2"
                    >
                        <img src={menu} alt="menu" />
                    </button>

                    <Link
                        to="/"
                        className="sm:h-auto sm:w-64 sm:col-start-2 sm:col-end-3 sm:mx-auto"
                    >
                        <img src={logo} className="" alt="풀무질" />
                    </Link>
                </div>
                {/* NAV BAR ELEMS including login and register */}
                <div
                    className={`lg:col-start-4 lg:col-end-11
                                lg:grid lg:grid-cols-7 lg:col-gap-2
                                sm:hidden `}
                >
                    {/* NAV BAR ELEMS */}
                    <div
                        className="lg:flex lg:flex-row 
                                    lg:col-start-1 lg:col-end-6
                                    lg:justify-around
                                    sm:flex sm:flex-col"
                    >
                        {/* EACH NAV BAR ELEMS */}
                        {elems.map((elem, index) => {
                            return (
                                <div
                                    className={`h-full flex 
                                        sm:mt-4
                                        lg:items-center lg:w-28
                                        lg:${
                                            this.props.location.pathname === elem.path
                                                ? 'bg-green-500'
                                                : 'bg-white'
                                        }`}
                                    key={index}
                                >
                                    <Link
                                        to={elem.path}
                                        onClick={() => {
                                            this.setState({ isOpen: !this.state.isOpen });
                                        }}
                                        className={`mx-auto lg:text-2xl sm:text-6xl font-regular tracking-wider
                                            lg:${
                                                this.props.location.pathname === elem.path
                                                    ? 'text-white'
                                                    : 'text-green-500'
                                            }
                                            sm:text-green-500
                                            `}
                                    >
                                        {elem.display}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* login and register */}
                    <div
                        className="lg:col-start-6 lg:col-end-8
                                    flex items-center 
                                    lg:justify-end
                                    lg:text-xl lg:text-right
                                    sm:text-5xl sm:mx-auto sm:mt-4
                                    text-green-500 
                                    font-regular tracking-wider"
                    >
                        <Link
                            to="/login"
                            onClick={() => {
                                this.setState({ isOpen: !this.state.isOpen });
                            }}
                            className=""
                        >
                            로그인
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => {
                                this.setState({ isOpen: !this.state.isOpen });
                            }}
                            className="ml-12"
                        >
                            회원가입
                        </Link>
                    </div>
                </div>

                <Slider
                    headerHeight="10%"
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
                        </div>
                    }
                    isOpen={this.state.isOpen}
                    leftToRight
                    onOutsideClick={() => this.setState({ isOpen: !this.state.isOpen })}
                ></Slider>

                {/* bottom bar */}
                <div
                    className="h-0 lg:w-auto sm:w-full
                                lg:col-start-1 lg:col-end-13 
                                border-green-500 lg:border-t-3 sm:border-3"
                />
            </div>
        );
    }
}

export default Nav;
