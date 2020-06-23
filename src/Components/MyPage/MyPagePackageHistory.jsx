import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPackageHistoriesByUser, getUserCookie } from '../../util/api';

import { timeStampToDateSimple, priceStr, priceStrToInt } from '../../util/localeStrings';

import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';

class MyPagePackageHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packageHistories: undefined,

            query: {
                page: 1,
                offset: 5,
                user: undefined,
            },
        };
        this.getUser();
    }

    getUser = async () => {
        const res = await getUserCookie();
        if (res.status === 200) {
            this.setState(
                {
                    query: {
                        ...this.state.query,
                        user: res.data,
                    },
                },
                this.reloadList,
            );
        }
    };

    reloadList = async () => {
        const query = this.state.query;
        const queryList = {
            page: query.page,
            offset: query.offset,
            user: query.user,
        };
        const res = await getPackageHistoriesByUser(queryList);
        if (res.status === 200) {
            if (res.data.length !== 0) {
                if (typeof res.data === 'object') {
                    this.setState({
                        packageHistories: res.data,
                    });
                } else {
                    this.setState({
                        packageHistories: '검색 결과가 없습니다.',
                    });
                }
            } else {
                this.setState({
                    query: {
                        ...this.state.query,
                        page: this.state.query.page > 1 ? this.state.query.page - 1 : 1,
                    },
                });
            }
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (
            this.state.packageHistories !== nState.packageHistories &&
            nState.packageHistories !== undefined
        ) {
            return true;
        }

        return true;
    }

    render() {
        console.log(this.state.packageHistories);
        return this.state.packageHistories ? (
            <div className="w-full h-auto p-4 flex flex-col border border-green-500">
                <div className="mb-8 w-full h-auto flex flex-col justify-between text-green-500">
                    <div className="mb-4 text-3xl text-green-500">꾸러미 주문 내역</div>
                    <p className="text-xl">주문 번호를 클릭해서 세부 내역 보기</p>
                </div>

                <div className="w-full h-auto ">
                    <table className="w-full">
                        <tbody>
                            <tr className="w-full h-16 flex flex-row justify-between text-green-500 border-b border-green-500">
                                <th className="w-20% self-center text-xl text-left font-normal">
                                    꾸러미 이름
                                </th>
                                <th className="text-xl self-center font-normal">결제 금액</th>
                                <th className="text-xl self-center font-normal">배송 상태</th>
                                <th className="text-xl self-center font-normal">주문 번호</th>
                                <th className="text-xl self-center font-normal">구독 여부</th>
                                <th className="text-xl self-center font-normal">주문일</th>
                            </tr>
                            {typeof this.state.packageHistories === 'object' ? (
                                this.state.packageHistories.map((d, i) => (
                                    <tr
                                        className="mb-4 flex flex-row justify-between text-green-500 border-b border-green-500"
                                        key={i}
                                    >
                                        <th className="w-20% text-left flex flex-row font-normal">
                                            <div className="text-base self-center">
                                                {d.package ? d.package.title : '꾸러미 미정'}
                                            </div>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {(
                                                priceStrToInt(priceStr(d.totalPrice)) -
                                                priceStrToInt(priceStr(d.creditUse)) +
                                                priceStrToInt(priceStr(d.shippingFee))
                                            ).toLocaleString()}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {d.transactionStatus}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <Link to={'/mypage/package-history/' + d.id}>
                                                {d.orderNum}
                                            </Link>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {d.isSubsc ? '예' : '아니오'}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {timeStampToDateSimple(d.purchaseDate)}
                                        </th>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-xl text-green-500">
                                    <th>"검색 결과가 없습니다."</th>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-8 mx-auto w-40% flex flex-row justify-around">
                        <button
                            onClick={() => {
                                this.setState(
                                    {
                                        query: {
                                            ...this.state.query,
                                            page:
                                                this.state.query.page > 1
                                                    ? this.state.query.page - 1
                                                    : this.state.query.page,
                                        },
                                    },
                                    this.reloadList,
                                );
                            }}
                        >
                            <img className="mx-auto w-2/12 h-auto" src={left} alt="left" />
                        </button>

                        <div className="text-xl">{this.state.query.page}</div>

                        <button
                            onClick={() => {
                                this.setState(
                                    {
                                        query: {
                                            ...this.state.query,
                                            page: this.state.query.page + 1,
                                        },
                                    },
                                    this.reloadList,
                                );
                            }}
                        >
                            <img className="mx-auto w-2/12 h-auto" src={right} alt="left" />
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-xl text-green-500">loading</div>
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cookie: state.cookie,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(MyPagePackageHistory);
