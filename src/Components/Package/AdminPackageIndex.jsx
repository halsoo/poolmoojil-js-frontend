import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getPackages, getPackageMonthly, deletePackage, changeOutOfStock } from '../../util/api';
import { priceStr, oneTimeMonthStr } from '../../util/localeStrings';

import triangle from '../../img/triangle.png';

export default class AdminPackageIndex extends Component {
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

    handleOutOfStock = async (event) => {
        const target = event.target;
        const name = target.name;

        const res = await changeOutOfStock(name);

        if (res.status === 200) {
            this.getMonthly();
            this.refreshList();
        }
    };

    delete = async (id) => {
        const res = await deletePackage(id);

        if (res.status === 204) {
            this.refreshList();
        }
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
        return (
            <div className="flex flex-col justify-between">
                <div className="w-full h-auto mb-4 p-4 flex flex-row">
                    <div className="w-full h-auto p-4 flex flex-row justify-between text-green-500">
                        <div className="w-50% h-full text-3xl">꾸러미 관리하기</div>
                        <div className="w-40% flex flex-row justify-between text-2xl">
                            <Link to="/package/subsc">구독 관리</Link>
                            <Link to="/package/history">주문 관리</Link>
                            <Link to="/package/add">+ 꾸러미 추가</Link>
                        </div>
                    </div>
                </div>

                {this.state.monthlyPackage ? (
                    <MonthlyPackage
                        package={this.state.monthlyPackage}
                        onChange={this.handleOutOfStock}
                        delete={this.delete}
                    />
                ) : null}
                {this.state.packages ? (
                    <PackageList
                        packages={this.state.packages}
                        onChange={this.handleOutOfStock}
                        delete={this.delete}
                    />
                ) : null}

                <button
                    className="relative mx-auto w-10% lg:h-12 sm:h-18 text-white"
                    onClick={this.handleMore}
                >
                    <img className="w-full" src={triangle} alt="" />
                </button>
            </div>
        );
    }
}

function EditButtons(props) {
    return (
        <div className="w-30% flex flex-col justify-between">
            <div className="ml-auto flex flex-row mb-4">
                <label className="mr-4 text-xl">품절</label>
                <input
                    type="checkbox"
                    name={props.id}
                    checked={props.outOfStock}
                    onChange={props.onChange}
                />
            </div>
            <div className="ml-auto mb-4 w-50% text-xl">
                <Link to={'/package/edit/' + props.id} className="mr-8">
                    수정
                </Link>
                <button onClick={() => props.delete(props.id)}>삭제</button>
            </div>
        </div>
    );
}

function EditButtonsItems(props) {
    return (
        <div className="w-full mt-8 flex flex-row justify-between">
            <div className="flex flex-row">
                <label className="mr-4 text-xl">품절</label>
                <input
                    type="checkbox"
                    name={props.id}
                    checked={props.outOfStock}
                    onChange={props.onChange}
                />
            </div>
            <div className="mb-4 w-50% text-xl">
                <Link to={'/package/edit/' + props.id} className="mr-8">
                    수정
                </Link>
                <button onClick={() => props.delete(props.id)}>삭제</button>
            </div>
        </div>
    );
}

function MonthlyPackage(props) {
    const monthlyPackage = props.package;
    const month = oneTimeMonthStr(monthlyPackage.date);
    const price = priceStr(monthlyPackage.price);

    return (
        <div className="mb-4 p-4 w-full flex flex-row justify-between text-white bg-green-500 border border-green-500">
            <div className="flex flex-col">
                <div className="mb-2 font-bold lg:text-2xl sm:text-5xl">이 달의 꾸러미</div>
                <div className="flex flex-row">
                    <div className="w-20% border border-green-500">
                        <img src={monthlyPackage.mainImg.link} alt="" />
                    </div>

                    <div className="w-80% my-auto ml-8 flex flex-col">
                        <p className="lg:text-lg sm:text-5xl mb-2">{month}의 꾸러미</p>
                        <p className="lg:text-xl sm:text-5xl mb-2">{monthlyPackage.title}</p>
                        <p className="lg:text-lg sm:text-4xl mb-2">
                            {monthlyPackage.monthlyCurated.book.title}
                        </p>
                        <p className="lg:text-lg sm:text-4xl">가격: {price}원</p>
                    </div>
                </div>
            </div>
            <EditButtons
                id={monthlyPackage.id}
                outOfStock={monthlyPackage.outOfStock}
                delete={props.delete}
                onChange={props.onChange}
            />
        </div>
    );
}

function PackageList(props) {
    return (
        <div className="flex flex-row flex-wrap items-stretch justify-between">
            {props.packages.map((g, index) => {
                return (
                    <div className="w-49% mb-4 ">
                        <PackageItem
                            key={index}
                            package={g}
                            delete={props.delete}
                            onChange={props.onChange}
                        />
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
                <img
                    className="self-center border border-green-500"
                    src={singlePackage.mainImg.link}
                    alt=""
                />
            </div>

            <div className="w-60% my-auto ml-8 flex-col">
                <p className="lg:text-lg sm:text-4xl mb-4">{month}의 꾸러미</p>

                <p className="lg:text-2xl sm:text-5xl mb-8">{singlePackage.title}</p>
                <p className="lg:text-lg sm:text-4xl mb-4">
                    {singlePackage.monthlyCurated.book.title}
                </p>
                <p className="lg:text-lg sm:text-4xl">가격: {price}원</p>
                <EditButtonsItems
                    id={singlePackage.id}
                    outOfStock={singlePackage.outOfStock}
                    delete={props.delete}
                    onChange={props.onChange}
                />
            </div>
        </div>
    );
}
