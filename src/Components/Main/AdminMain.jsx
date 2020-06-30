import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutTry } from '../../actions';

import logo from '../../img/main_logo.png';
import mainImg from '../../img/main_img.png';

class AdminMain extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="flex flex-col">
                <div
                    className="lg:h-plg sm:h-p2xl relative overflow-hidden
                                border border-green-500"
                >
                    <img src={mainImg} className="absolute top-0 left-0 w-full" alt="풀무질" />
                    <img src={logo} className="absolute inset-y-0 right-0 h-full" alt="logo" />
                </div>

                <div className="w-full mt-2 h-40 flex justify-center text-white bg-green-500">
                    <p className="text-3xl my-auto">Admin Page</p>
                </div>

                <Link
                    to="/users"
                    className="w-50% h-16 mt-8 mx-auto flex justify-center text-3xl text-white bg-green-500"
                >
                    <div className="self-center">회원 관리</div>
                </Link>

                <button
                    onClick={() => this.props.logoutTry()}
                    className="w-50% h-16 my-8 mx-auto text-3xl text-white bg-green-500"
                >
                    어드민 로그아웃
                </button>
            </div>
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
});

const MapDispatchToProps = { logoutTry };

export default connect(MapStateToProps, MapDispatchToProps)(AdminMain);
