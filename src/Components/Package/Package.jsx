import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getPackages, getPackageMonthly } from '../../util/api';
import { priceStr, oneTimeMonthStr } from '../../util/localeStrings';

import packageImg from '../../img/package_img.jpg';
import triangle from '../../img/triangle.png';

class Package extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packages: [],
            query: {
                page: 1,
                offset: 4,
            },
        };
        this.getMonthly();
        this.refreshList();
    }

    getMonthly = async () => {
        const res = await getPackageMonthly();
        if (res.status === 200) {
            this.setState({
                monthlyPackage: res.data,
            });
        }
    };

    refreshList = async () => {
        const query = this.state.query;
        const queryList = {
            page: 1,
            offset: query.offset,
        };
        const res = await getPackages(queryList);
        if (res.status === 200) {
            this.setState({
                packages: res.data,
            });
        }
    };

    pushList = async () => {
        const query = this.state.query;
        const queryList = {
            page: query.page,
            offset: query.offset,
        };
        const res = await getPackages(queryList);
        if (res.status === 200) {
            if (res.data.length !== 0) {
                let packages = this.state.packages;
                packages.push(...res.data);
                this.setState({
                    packages: packages,
                });
            } else {
                this.setState({
                    query: {
                        ...this.state.query,
                        page: this.state.query.page - 1,
                    },
                });
            }
        }
    };

    handleMore = () => {
        this.setState(
            {
                query: {
                    ...this.state.query,
                    page: this.state.query.page + 1,
                },
            },
            this.pushList,
        );
    };

    shouldComponentUpdate(nProps, nState) {
        if (
            this.state.monthlyPackage !== nState.monthlyPackage ||
            this.state.packages !== nState.packages
        ) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.monthlyPackage && this.state.packages ? (
            <div className="flex flex-col justify-between">
                <div className="w-full h-auto mb-4 p-4 flex flex-row border border-green-500">
                    <div className="sm:hidden w-25% h-full mr-4 ">
                        <img className="h-full w-full" src={packageImg} alt="gathering_img" />
                    </div>

                    <div className="flex flex-col justify-between text-green-500">
                        <div>
                            <div className="font-bold lg:text-2xl sm:text-5xl">꾸러미란?</div>
                            <div className="lg:text-xl sm:text-4xl">
                                풀무질에서는 매월 신중히 선정한 읽기 세트 꾸러미를 제작합니다.
                            </div>
                        </div>

                        <PackageDesc
                            title="꾸러미의 구성 상품"
                            mainDesc="이 달의 책 + 이 달의 책 읽기 가이드 + 이 달의 풀무질 굿즈"
                        />

                        <PackageDesc
                            title="꾸러미 구독이란?"
                            mainDesc="꾸러미는 3개월 단위로 구독이 가능합니다. 구독을 하셨을 경우 할인 및 다양한 해택이 준비되어 있습니다."
                        />
                    </div>
                </div>

                <MonthlyPackage package={this.state.monthlyPackage} />

                <PackageList packages={this.state.packages} />

                <button
                    className="relative mx-auto w-10% lg:h-12 sm:h-18 text-white"
                    onClick={this.handleMore}
                >
                    <img className="w-full" src={triangle} alt="" />
                </button>
            </div>
        ) : (
            <div className="lg:text-xl sm:text-5xl text-green-500">loading</div>
        );
    }
}

const MapStateToProps = (state) => ({});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(Package);

function PackageDesc(props) {
    return (
        <div className="mb-4">
            <h2 className="lg:text-xl sm:text-4xl">{props.title}</h2>

            <p className="sm:text-4xl">{props.mainDesc}</p>
        </div>
    );
}

function MonthlyPackage(props) {
    const monthlyPackage = props.package;
    const month = oneTimeMonthStr(monthlyPackage.date);
    const price = priceStr(monthlyPackage.price);

    return (
        <div className="mb-4 p-4 flex flex-col text-white bg-green-500 border border-green-500">
            <div className="mb-2 font-bold lg:text-2xl sm:text-5xl">이 달의 꾸러미</div>
            <div className="flex flex-row">
                <div className="lg:w-20% sm:w-30% border border-green-500">
                    <img src={monthlyPackage.mainImg.link} alt="" />
                </div>

                <div className="lg:w-80% sm:w-70% my-auto ml-8 flex flex-col">
                    <p className="lg:text-lg sm:text-5xl mb-2">{month}의 꾸러미</p>
                    <Link to={'/package/' + monthlyPackage.id}>
                        <p className="lg:text-xl sm:text-6xl mb-2">{monthlyPackage.title}</p>
                    </Link>
                    <p className="lg:text-lg sm:text-4xl mb-2">
                        {monthlyPackage.monthlyCurated.book.title}
                    </p>
                    <p className="lg:text-lg sm:text-4xl">가격: {price}원</p>
                </div>
            </div>
        </div>
    );
}

function PackageList(props) {
    return (
        <div className="flex lg:flex-row lg:flex-wrap sm:flex-col items-stretch justify-between">
            {props.packages.map((g, index) => {
                return (
                    <div className="lg:w-49% sm:w-full mb-4 ">
                        <PackageItem key={index} package={g} />
                    </div>
                );
            })}
        </div>
    );
}

function PackageItem(props) {
    const singlePackage = props.package;
    const month = oneTimeMonthStr(singlePackage.date);
    const price = priceStr(singlePackage.price);

    return (
        <div className="p-4 flex flex-row justify-between text-green-500 border border-green-500">
            <div className="w-40% flex flex-col justify-center">
                <Link to={'/package/' + singlePackage.id}>
                    <img
                        className="self-center border border-green-500"
                        src={singlePackage.mainImg.link}
                        alt=""
                    />
                </Link>
            </div>

            <div className="w-60% my-auto ml-8 flex-col">
                <p className="lg:text-lg sm:text-4xl mb-4">{month}의 꾸러미</p>
                <Link to={'/package/' + singlePackage.id}>
                    <p className="lg:text-2xl sm:text-5xl mb-8">{singlePackage.title}</p>
                </Link>
                <p className="lg:text-lg sm:text-4xl mb-4">
                    {singlePackage.monthlyCurated.book.title}
                </p>
                <p className="lg:text-lg sm:text-4xl">가격: {price}원</p>
            </div>
        </div>
    );
}
