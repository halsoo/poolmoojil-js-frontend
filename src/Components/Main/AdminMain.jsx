import React, { Component } from 'react';

import logo from '../../img/main_logo.png';
import mainImg from '../../img/main_img.png';

export default class AdminMain extends Component {
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
            </div>
        );
    }
}
