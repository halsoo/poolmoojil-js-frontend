import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { getUpcomingGathering, getPackageMonthly, getGoods, getNotices } from '../../util/api';
import {
    priceStr,
    rangeDateStr,
    oneTimeDateStr,
    oneTimeMonthStr,
    timeStampToDate,
} from '../../util/localeStrings';

import logo from '../../img/main_logo.png';
import mainImg from '../../img/main_img.png';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packageMonthly: undefined,
            gathering: undefined,
            goods: undefined,
        };
        this.upcomingGathering();
        this.getPackageMonthly();
        this.loadGoods();
        this.loadNotices();
    }

    upcomingGathering = async () => {
        const res = await getUpcomingGathering();
        if (res.status === 200) {
            this.setState({
                gathering: res.data,
            });
        }
    };

    getPackageMonthly = async () => {
        const res = await getPackageMonthly();
        if (res.status === 200) {
            this.setState({
                packageMonthly: res.data,
            });
        }
    };

    loadGoods = async () => {
        const query = {
            page: 1,
            offset: 3,
        };
        const res = await getGoods(query);
        if (res.status === 200) {
            this.setState({
                goods: res.data,
            });
        }
    };

    loadNotices = async () => {
        const queryList = {
            page: 1,
            offset: 6,
        };
        const res = await getNotices(queryList);

        if (res.status === 200) {
            this.setState({
                notices: res.data,
            });
        }
    };

    render() {
        return (
            <div className="flex flex-col">
                <div
                    className="h-plg relative overflow-hidden
                                border border-green-500"
                >
                    <img src={mainImg} className="absolute top-0 left-0 w-full" alt="풀무질" />
                    <img src={logo} className="absolute inset-y-0 right-0 h-full" alt="logo" />
                </div>

                <div className="w-full mt-2 h-40 flex justify-center text-white bg-green-500">
                    <p className="text-3xl my-auto">PG사 심사를 위한 테스트 사이트입니다</p>
                </div>

                <div className="mt-2 flex flex-row flex-wrap justify-between items-stretch">
                    {this.state.gathering ? (
                        <UpcomingGathering gathering={this.state.gathering} />
                    ) : null}
                    {this.state.packageMonthly ? (
                        <MonthlyPackage package={this.state.packageMonthly} />
                    ) : null}
                    {this.state.goods ? (
                        <ThreeItems title="풀무질 굿즈" name="goods" items={this.state.goods} />
                    ) : null}
                    {this.state.notices ? (
                        <div className="w-49% p-4 flex flex-col border border-green-500 text-green-500">
                            <div className="mb-4 flex flex-row justify-between">
                                <p className="text-2xl font-bold">공지</p>
                                <Link to="/notice">
                                    <p className="text-xl font-bold">더보기</p>
                                </Link>
                            </div>
                            <table className="w-full">
                                <tbody>
                                    {this.state.notices.map((d, i) => (
                                        <tr
                                            className="flex flex-row justify-between border-b border-green-500"
                                            key={i}
                                        >
                                            <th className="text-left font-normal">
                                                <div className="text-xl">{d.title}</div>
                                            </th>
                                            <th className="my-auto text-base font-normal">
                                                {timeStampToDate(d.createdAt)}
                                            </th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

function MonthlyPackage(props) {
    const monthlyPackage = props.package;
    const month = oneTimeMonthStr(monthlyPackage.date);
    const price = priceStr(monthlyPackage.price);

    return (
        <div className="w-49% mb-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-2 font-bold text-2xl">이 달의 꾸러미</div>
            <div className="h-full flex flex-row">
                <div className="w-40% h-auto my-auto flex border border-green-500">
                    <Link to={'/package/' + monthlyPackage.id}>
                        <img className="h-auto" src={monthlyPackage.mainImg.link} alt="" />
                    </Link>
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

function UpcomingGathering(props) {
    const gathering = props.gathering;
    const fullDate = gathering.rangeDate ? rangeDateStr(gathering.rangeDate) : null;
    const oneDate = gathering.oneTimeDate ? oneTimeDateStr(gathering.oneTimeDate) : null;

    return (
        <div className="w-49% mb-4 p-4 flex flex-col text-white bg-green-500">
            <div className="mb-2 font-bold text-2xl">다가오는 모임</div>
            <div className="h-full flex flex-row">
                <div className="w-40% h-auto my-auto flex border border-green-500">
                    <Link to={'/gathering/' + gathering.id}>
                        <img className="h-auto" src={gathering.mainImg.link} alt="" />
                    </Link>
                </div>

                <div className="w-80% my-auto ml-8 flex flex-col">
                    <p className="text-lg mb-2">{gathering.format}</p>
                    <Link to={'/gathering/' + gathering.id}>
                        <p className="text-2xl mb-2">{gathering.title}</p>
                    </Link>
                    <p className="text-lg">
                        {fullDate ? fullDate : oneDate ? oneDate : gathering.stringDate}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ThreeItems(props) {
    const mb = props.mb;
    return (
        <div
            className={`w-49% ${
                mb ? 'mb-4' : 'mb-0'
            } p-4 flex flex-col text-green-500 border border-green-500`}
        >
            <div className="w-full flex flex-row justify-between">
                <div className="mb-2 font-bold text-2xl">{props.title}</div>
                <div>
                    {props.name === 'goods' ? (
                        <Link className="font-bold text-xl" to="/store/good">
                            더보기
                        </Link>
                    ) : (
                        <button
                            className="font-bold text-xl"
                            onClick={(e) => props.onClick(e, props.name)}
                        >
                            더보기
                        </button>
                    )}
                </div>
            </div>

            <div className="my-auto flex flex-row justify-between">
                {props.items.map((item, index) => {
                    return (
                        <div key={index} className="w-30% flex flex-col">
                            <Link
                                className="mx-auto font-bold"
                                to={
                                    item.name ? '/store/goods/' + item.id : '/store/book/' + item.id
                                }
                            >
                                <img className="mx-auto mb-2" src={item.mainImg.link} alt="" />
                            </Link>
                            <Link
                                className="mx-auto font-bold"
                                to={
                                    item.name ? '/store/goods/' + item.id : '/store/book/' + item.id
                                }
                            >
                                {item.name ? item.name : item.title}
                            </Link>
                            {item.author ? <p className="mx-auto">{item.author}</p> : null}
                            <p className="mx-auto">{priceStr(item.price) + '원'}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
