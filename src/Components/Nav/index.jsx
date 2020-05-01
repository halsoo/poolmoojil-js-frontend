import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Slider from '../SlideOut';

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
                        <Link to="/login" className="">
                            로그인
                        </Link>
                        <Link to="/register" className="ml-12">
                            회원가입
                        </Link>
                    </div>
                </div>

                {/* bottom bar */}
                <div
                    className="h-0 w-auto sm:w-full
                                col-start-1 col-end-13 
                                border-green-500 border-t-3 sm:border-3"
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
                        className="w-16 ml-16 col-start-1 col-end-2"
                    >
                        <img src={menu} alt="menu" />
                    </button>

                    <Link to="/" className="h-auto w-64 col-start-2 col-end-3 mx-auto">
                        <img src={logo} className="" alt="풀무질" />
                    </Link>
                </div>

                <Slider
                    headerHeight={9}
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
                    className="flex flex-col"
                >
                    {elems.map((elem, index) => {
                        return (
                            <div className="flex mt-4 items-center" key={index}>
                                <Link
                                    to={elem.path}
                                    className="mr-auto text-6xl text-white font-regular tracking-wider"
                                >
                                    {elem.display}
                                </Link>
                            </div>
                        );
                    })}
                </Slider>

                {/* bottom bar */}
                <div className="h-0 sm:w-full border-green-500 border-t-3 sm:border-3" />
            </div>
        );
    }
}

export default Nav;
