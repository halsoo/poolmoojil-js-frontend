import React, { Component } from 'react';

import logo from '../../img/logo.png';

export default class Footer extends Component {
    render() {
        return (
            <div className="grid grid-cols-12 col-gap-4">
                <div className="sm:hidden h-0 col-start-3 col-end-11 border-green-500 border-t" />
                <div
                    className="p-4 
                                lg:col-start-3 lg:col-end-11
                                sm:col-start-2 sm:col-end-12"
                >
                    <div className="grid grid-cols-24 grid-rows-2">
                        <img
                            src={logo}
                            className="sm:hidden h-auto lg:col-start-1 lg:col-end-3 row-start-1 row-end-2"
                            alt="풀무질"
                        />

                        <div
                            className="pl-4 
                                        lg:col-start-3 lg:col-end-25 
                                        sm:col-start-1 sm:col-end-25
                                        row-start-1 row-end-2
                                        lg:text-xs sm:text-lg
                                        text-green-500 font-regular 
                                        tracking-wider self-center"
                        >
                            <span>
                                사단법인 두루미 | 서울특별시 종로구 성균관로 19 지하 1층 |
                                사업자등록번호: 123-45-678900 | 통신판매업: 2019-서울혜화-00000 |
                                대표: 전범선 | 개인정보관리책임자: 홍성환 (poolmoojil@dooroomee.com)
                                | 호스팅사업자: 아마존웹서비스(Amazon Web Service)
                            </span>
                        </div>

                        <div className="relative col-start-1 col-end-25 row-start-2 row-end-3">
                            <div
                                className="absolute top-0 right-0 
                                        text-xs text-green-500 font-regular 
                                        tracking-wider"
                            >
                                ©2020 by 풀무질
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
