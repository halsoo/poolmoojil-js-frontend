import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getPackageByID } from '../../util/api';
import { priceStr, oneTimeMonthStr, dateToTime } from '../../util/localeStrings';

class PackageItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            package: undefined,
            elems: undefined,
        };

        this.getInfo();
    }

    getInfo = async () => {
        const res = await getPackageByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState(
                {
                    package: res.data,
                },
                this.getElems,
            );
        }
    };

    getElems = () => {
        let pastArray = [...this.state.package.bookList];
        pastArray.push(...this.state.package.goodList);
        let fullList = pastArray;
        this.setState({
            elems: fullList,
        });
    };

    render() {
        const singlePackage = this.state.package;
        const today = new Date().getTime();
        const packageDay = singlePackage ? dateToTime(singlePackage.date) : null;
        console.log(singlePackage);

        return singlePackage ? (
            <div className="flex flex-col">
                <div className="flex flex-row justify-between border border-green-500">
                    <div className="w-50% h-auto ">
                        <PackageItemDesc package={singlePackage} />
                    </div>
                    <div className="w-50% h-auto p-4 flex flex-col">
                        <div className="w-90% mx-auto">
                            <img
                                className="w-full border border-green-500"
                                src={singlePackage.mainImg.link}
                            />

                            {!this.props.logged.status ? (
                                <ButtonLogin />
                            ) : packageDay < today ? (
                                <ButtonOver />
                            ) : (
                                <ButtonGroup
                                    bookId={singlePackage.monthlyCurated.book[0].id}
                                    packageId={singlePackage.id}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {this.state.elems ? (
                    <div className="mt-2 p-4 flex flex-col text-green-500 border border-green-500">
                        <p className="m-4 text-2xl mb-4">꾸러미 구성품</p>
                        <PackageElems
                            elem={singlePackage.monthlyCurated.book[0]}
                            index={'이 달의 책'}
                            last={false}
                        />
                        {this.state.elems.map((item, index) => {
                            let last = false;
                            if (index === this.state.elems.length - 1) last = true;
                            return (
                                <PackageElems key={index} elem={item} index={index} last={last} />
                            );
                        })}
                    </div>
                ) : null}
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(PackageItem);

function PackageItemDesc(props) {
    const singlePackage = props.package;

    const body = singlePackage.desc.split(/\r\n|\r|\n/);

    const month = oneTimeMonthStr(singlePackage.date);
    const price = priceStr(singlePackage.price);

    return (
        <div className="w-full h-full p-4 flex flex-col text-green-500">
            <p className="text-2xl mb-4">{month}의 꾸러미</p>
            <p className="text-3xl mb-4">{singlePackage.title}</p>
            <p className="text-xl mb-4">'{singlePackage.bookList[0].title}' 꾸러미</p>
            <p className="text-xl mb-10">가격: {price}</p>

            <div>
                {body.map((para, index) => {
                    return (
                        <p className="mb-6 lg:text-base sm:text-4xl" key={index}>
                            {para}
                        </p>
                    );
                })}
            </div>
        </div>
    );
}

function ButtonLogin(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button className="w-full h-18 text-white text-2xl bg-green-500" name="needLogin">
                <Link to="/login">구독하려면 로그인</Link>
            </button>
        </div>
    );
}

function ButtonOver(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button className="w-full h-18 text-white text-2xl bg-green-500">
                지난 꾸러미입니다
            </button>
        </div>
    );
}

function ButtonGroup(props) {
    return (
        <div className="mt-2 flex flex-col justify-between">
            <div className="mb-2 flex flex-row justify-between">
                <button
                    className="w-49% h-18 text-2xl text-green-500 border border-green-500"
                    name="oneTime"
                >
                    <Link to={'/package/onetime/' + props.packageId}>구러미 구매</Link>
                </button>

                {props.bookId ? (
                    <button className="w-49% h-18 text-2xl text-green-500 border border-green-500">
                        <Link to={'/store/book/' + props.bookId}>이 달의 책 구매</Link>
                    </button>
                ) : null}
            </div>

            <button className="w-full h-18 text-2xl text-white bg-green-500" name="fullTime">
                <Link to={'/package/sixmonths/' + props.packageId}>꾸러미 구독</Link>
            </button>
        </div>
    );
}

function PackageElems(props) {
    const elem = props.elem;

    return (
        <div className="flex flex-col">
            <div className="w-full p-4 flex flex-row justify-between">
                <img className="flex-grow-0" src={elem.mainImg.link} alt="" />
                <div className="w-50% my-auto px-10 flex-grow ">
                    <p className="mb-4 text-lg">
                        {props.index === '이 달의 책'
                            ? '이 달의 책'
                            : props.index + 1 + '번째 구성품'}
                    </p>
                    <p className="mb-4 text-2xl">{elem.title ? elem.title : elem.name}</p>
                    {elem.author ? (
                        <div>
                            <p className="mb-4 text-lg">저자: {elem.author}</p>
                            <p className="mb-4 text-lg">출판사: {elem.publishingCompany}</p>
                        </div>
                    ) : (
                        <p className="mb-4 text-lg">제작: {elem.maker}</p>
                    )}
                </div>

                <button className="w-20% h-18 my-auto text-2xl text-white bg-green-500">
                    <Link to={elem.title ? '/store/book' + elem.id : '/store/good' + elem.id}>
                        장터에서 보기
                    </Link>
                </button>
            </div>
            {!props.last ? <div className="border-b border-green-500" /> : null}
        </div>
    );
}
