import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserCookie, getOrderHistoriesByUser } from '../../util/api';

import { timeStampToDateSimple, priceStr, priceStrToInt } from '../../util/localeStrings';

import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';

class MyPageOrderHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderHistories: undefined,

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
        const res = await getOrderHistoriesByUser(queryList);
        if (res.status === 200) {
            if (res.data.length !== 0) {
                if (typeof res.data === 'object') {
                    this.setState({
                        orderHistories: res.data,
                    });
                } else {
                    this.setState({
                        orderHistories: '검색 결과가 없습니다.',
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
            this.state.orderHistories !== nState.orderHistories &&
            nState.orderHistories !== undefined
        ) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.orderHistories ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-col justify-between text-green-500">
                    <p className="text-3xl">주문 내역</p>
                    <p className="text-xl">주문 번호를 클릭해서 세부 내역 보기</p>
                </div>

                <div className="w-full p-4 h-auto border border-green-500">
                    <table className="w-full p-4">
                        <tbody>
                            <tr className="w-full h-16 flex flex-row justify-between text-green-500 border-b border-green-500">
                                <th className="text-xl self-center font-normal">주문번호</th>
                                <th className="text-xl self-center font-normal">결제 금액</th>
                                <th className="text-xl self-center font-normal">배송 상태</th>
                                <th className="text-xl self-center font-normal">주문 일자</th>
                            </tr>
                            {typeof this.state.orderHistories === 'object' ? (
                                this.state.orderHistories.map((d, i) => (
                                    <tr
                                        className="mb-4 flex flex-row justify-between text-green-500 border-b border-green-500"
                                        key={i}
                                    >
                                        <th className="w-20% text-left flex flex-row font-normal">
                                            <Link to={'/mypage/order-history/' + d.orderNum}>
                                                <div className="text-base self-center">
                                                    {d.orderNum}
                                                </div>
                                            </Link>
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
                                            {timeStampToDateSimple(d.createdAt)}
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

export default connect(MapStateToProps, MapDispatchToProps)(MyPageOrderHistory);
