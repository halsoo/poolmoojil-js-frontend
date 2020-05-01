import React, { Component } from 'react';

import axios from 'axios';

import logo from '../../img/main_logo.png';
import mainImg from '../../img/main_img.png';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div
                    className="h-plg relative overflow-hidden
                                border border-green-500"
                >
                    <img src={mainImg} className="absolute top-0 left-0 w-full" alt="풀무질" />
                    <img src={logo} className="absolute inset-y-0 right-0 h-full" alt="logo" />
                </div>
            </div>
        );
    }
}
