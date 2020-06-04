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

    render() {
        return (
            <div className="flex flex-col justify-between">
                <div className="w-full h-auto mb-4 p-4 flex flex-row border border-green-500">
                    <div className="w-25% h-full mr-4 ">
                        <img className="h-full w-full" src={packageImg} alt="gathering_img" />
                    </div>

                    <div className="flex flex-col justify-between text-green-500">
                        <div>
                            <div className="font-bold text-2xl">꾸러미란?</div>
                            <div className="text-xl">
                                풀무질에서는 매월 신중히 선정한 읽기 세트 꾸러미를 제작합니다.
                            </div>
                        </div>

                        <PackageDesc
                            title="꾸러미의 구성 상품"
                            mainDesc="이 달의 책 + 이 달의 책 읽기 가이드 + 이 달의 풀무질 굿즈"
                        />

                        <PackageDesc
                            title="꾸러미 구독이란?"
                            mainDesc="꾸러미는 6개월, 1년 단위로 구독이 가능합니다. 구독을 하셨을 경우 할인 및 다양한 해택이 준비되어 있습니다."
                        />
                    </div>
                </div>

                {this.state.monthlyPackage ? (
                    <MonthlyPackage package={this.state.monthlyPackage} />
                ) : null}

                <PackageList packages={this.state.packages} />

                <button
                    className="relative mx-auto w-10% h-12 text-white"
                    onClick={this.handleMore}
                >
                    <img className="w-full" src={triangle} alt="" />
                    <div className="absolute top-0 left-2vw">더보기</div>
                </button>
            </div>
        );
    }
}

const MapStateToProps = (state) => ({});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(Package);

function PackageDesc(props) {
    return (
        <div className="mb-4">
            <h2 className="text-xl">{props.title}</h2>

            <p>{props.mainDesc}</p>
        </div>
    );
}

function MonthlyPackage(props) {
    const monthlyPackage = props.package;
    const month = oneTimeMonthStr(monthlyPackage.date);
    const price = priceStr(monthlyPackage.price);

    return (
        <div className="mb-4 p-4 flex flex-col text-white bg-green-500 border border-green-500">
            <div className="mb-2 font-bold text-2xl">이 달의 꾸러미</div>
            <div className="flex flex-row">
                <div className="w-20% border border-green-500">
                    <img src={monthlyPackage.mainImg.link} alt="" />
                </div>

                <div className="w-80% my-auto ml-8 flex flex-col">
                    <p className="text-lg mb-2">{month}의 꾸러미</p>
                    <Link to={'/package/' + monthlyPackage.id}>
                        <p className="text-2xl mb-2">{monthlyPackage.title}</p>
                    </Link>
                    <p className="text-lg mb-2">{monthlyPackage.bookList[0].title}</p>
                    <p className="text-lg">가격: {price}원</p>
                </div>
            </div>
        </div>
    );
}

function PackageList(props) {
    return (
        <div className="flex flex-row flex-wrap items-stretch justify-between">
            {props.packages.map((g, index) => {
                return (
                    <div className="w-49% mb-4 ">
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
            <div className="w-40% flex justify-center border border-green-500">
                <Link to={'/package/' + singlePackage.id}>
                    <img src={singlePackage.mainImg.link} alt="" />
                </Link>
            </div>

            <div className="w-60% my-auto ml-8 flex-col">
                <p className="text-lg mb-4">{month}의 꾸러미</p>
                <Link to={'/package/' + singlePackage.id}>
                    <p className="text-2xl mb-8">{singlePackage.title}</p>
                </Link>
                <p className="text-lg mb-4">{singlePackage.bookList[0].title}</p>
                <p className="text-lg">가격: {price}원</p>
            </div>
        </div>
    );
}
