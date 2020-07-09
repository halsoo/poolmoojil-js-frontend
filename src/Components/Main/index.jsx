import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
    getUpcomingGathering,
    getBookCurated,
    getPackageMonthly,
    getGoods,
    getNotices,
} from '../../util/api';
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
            //packageMonthly: undefined,
            curatedMonthly: undefined,
            gathering: undefined,
            goods: undefined,
        };
        this.upcomingGathering();
        //this.getPackageMonthly();
        this.loadGoods();
        this.loadNotices();
        this.loadCuratedMonthly();
    }

    upcomingGathering = async () => {
        const res = await getUpcomingGathering();
        if (res.status === 200) {
            this.setState({
                gathering: res.data,
            });
        }
    };

    loadCuratedMonthly = async () => {
        const query = {
            page: 1,
            offset: 1,
        };
        const res = await getBookCurated(query);
        if (res.status === 200) {
            this.setState({
                curatedMonthly: res.data[0],
            });
        }
    };

    // getPackageMonthly = async () => {
    //     const res = await getPackageMonthly();
    //     if (res.status === 200) {
    //         this.setState({
    //             packageMonthly: res.data,
    //         });
    //     }
    // };

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

    shouldComponentUpdate(nProps, nState) {
        if (
            this.state.gathering !== nState.gathering ||
            this.state.packageMonthly !== nState.packageMonthly ||
            this.state.goods !== nState.goods ||
            this.state.notices !== nState.notices
        ) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.gathering &&
            //this.state.packageMonthly &&
            this.state.curatedMonthly &&
            this.state.goods &&
            this.state.notices ? (
            <div className="flex flex-col">
                <div
                    className="lg:h-plg sm:h-p2xl relative overflow-hidden
                                border border-green-500"
                >
                    <img
                        src={mainImg}
                        className="absolute top-0 left-0 w-full h-full"
                        alt="풀무질"
                    />
                    <img src={logo} className="absolute inset-y-0 right-0 h-full" alt="logo" />
                </div>

                <div className="mt-2 flex lg:flex-row sm:flex-col lg:flex-wrap justify-between items-stretch">
                    <UpcomingGathering gathering={this.state.gathering} />

                    {/* <MonthlyPackage package={this.state.packageMonthly} /> */}
                    <MonthlyCurated curation={this.state.curatedMonthly} />

                    <ThreeItems
                        title="풀무질 굿즈"
                        name="good"
                        items={this.state.goods}
                        mb={true}
                    />

                    <div className="lg:w-49% sm:w-full sm:mt-4 p-4 flex flex-col border border-green-500 text-green-500">
                        <div className="mb-4 flex flex-row justify-between">
                            <p className="lg:text-2xl sm:text-5xl font-bold">공지</p>
                            <Link to="/notice">
                                <p className="lg:text-xl sm:text-5xl font-bold">더보기</p>
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
                                            <div className="lg:text-2xl sm:text-5xl">{d.title}</div>
                                        </th>
                                        <th className="my-auto lg:text-base sm:text-5xl font-normal">
                                            {timeStampToDate(d.createdAt)}
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ) : (
            <div className="lg:text-xl sm:text-5xl text-green-500">loading</div>
        );
    }
}

function MonthlyPackage(props) {
    const monthlyPackage = props.package;
    const month = oneTimeMonthStr(monthlyPackage.date);
    const price = priceStr(monthlyPackage.price);

    return (
        <div className="lg:w-49% sm:w-full mb-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-2 font-bold lg:text-2xl sm:text-5xl">이 달의 꾸러미</div>
            <div className="h-full flex flex-row">
                <div className="w-40% h-auto my-auto flex border border-green-500">
                    <Link to={'/package/' + monthlyPackage.id}>
                        <img className="h-auto" src={monthlyPackage.mainImg.link} alt="" />
                    </Link>
                </div>

                <div className="w-80% my-auto ml-8 flex flex-col">
                    <p className="lg:text-lg sm:text-5xl mb-2">{month}의 꾸러미</p>
                    <Link to={'/package/' + monthlyPackage.id}>
                        <p className="lg:text-2xl sm:text-5xl mb-2">{monthlyPackage.title}</p>
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

function UpcomingGathering(props) {
    const gathering = props.gathering;
    const fullDate = gathering.rangeDate ? rangeDateStr(gathering.rangeDate) : null;
    const oneDate = gathering.oneTimeDate ? oneTimeDateStr(gathering.oneTimeDate) : null;

    return (
        <div className="lg:w-49% sm:w-full mb-4 p-4 flex flex-col text-white bg-green-500">
            <div className="mb-2 font-bold lg:text-2xl sm:text-5xl">다가오는 모임</div>
            <div className="h-full flex flex-row">
                <div className="w-40% h-auto my-auto flex border border-green-500">
                    <Link to={'/gathering/' + gathering.id}>
                        {gathering.mainImg ? (
                            <img className="h-auto" src={gathering.mainImg.link} alt="" />
                        ) : (
                            <div className="h-auto bg-purple-500" />
                        )}
                    </Link>
                </div>

                <div className="w-80% my-auto ml-8 flex flex-col">
                    <p className="lg:text-lg sm:text-4xl mb-2">{gathering.format}</p>
                    <Link to={'/gathering/' + gathering.id}>
                        <p className="lg:text-2xl sm:text-5xl mb-2">{gathering.title}</p>
                    </Link>
                    <p className="lg:text-lg sm:text-4xl">
                        {fullDate ? fullDate : oneDate ? oneDate : gathering.stringDate}
                    </p>
                </div>
            </div>
        </div>
    );
}

function MonthlyCurated(props) {
    const book = props.curation.book;
    console.log(book);
    //const month = oneTimeMonthStr(props.curation.date);
    const price = book ? priceStr(book.price) : null;

    return (
        <div className="lg:w-49% sm:w-full mb-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="w-full mb-2 flex flex-row justify-between">
                <div className="font-bold lg:text-2xl sm:text-5xl">이 주의 책</div>
                {/* <div>
                    <button
                        className="font-bold lg:text-xl sm:text-4xl"
                        onClick={(e) => props.onClick(e, 'monthly')}
                    >
                        더보기
                    </button>
                </div> */}
            </div>
            {book ? (
                <div className="h-full flex flex-row">
                    <div className="w-40% my-auto flex justify-center border border-green-500">
                        <Link to={'/store/book/' + book.id}>
                            {book.mainImg ? (
                                <img src={book.mainImg.link} alt="" />
                            ) : (
                                <div className="bg-purple-500" />
                            )}
                        </Link>
                    </div>

                    <div className="w-80% my-auto ml-8 flex flex-col">
                        <Link to={'/store/book/' + book.id}>
                            <p className="lg:text-2xl sm:text-5xl mb-2">{book.title}</p>
                        </Link>
                        <p className="lg:text-lg sm:text-4xl mb-2">저자: {book.author}</p>
                        <p className="lg:text-lg sm:text-4xl mb-2">
                            출판사: {book.publishingCompany}
                        </p>
                        <p className="lg:text-lg sm:text-4xl">가격: {price}원</p>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function ThreeItems(props) {
    const mb = props.mb;
    return (
        <div
            className={`lg:w-49% sm:w-full ${
                mb ? 'mb-4' : 'mb-0'
            } p-4 flex flex-col text-green-500 border border-green-500`}
        >
            <div className="w-full flex flex-row justify-between">
                <div className="mb-2 font-bold lg:text-2xl sm:text-5xl">{props.title}</div>
                <div>
                    {props.name === 'good' ? (
                        <Link className="font-bold lg:text-xl sm:text-5xl" to="/store/good">
                            더보기
                        </Link>
                    ) : (
                        <button
                            className="font-bold lg:text-xl sm:text-5xl"
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
                                to={item.name ? '/store/good/' + item.id : '/store/book/' + item.id}
                            >
                                <img className="mx-auto mb-2" src={item.mainImg.link} alt="" />
                            </Link>
                            <Link
                                className="mx-auto sm:text-4xl font-bold"
                                to={item.name ? '/store/good/' + item.id : '/store/book/' + item.id}
                            >
                                {item.name ? item.name : item.title}
                            </Link>
                            {item.author ? (
                                <p className="mx-auto sm:text-4xl">{item.author}</p>
                            ) : null}
                            <p className="mx-auto sm:text-4xl">{priceStr(item.price) + '원'}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
