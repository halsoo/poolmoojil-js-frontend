import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { getPackageSubscByID, changeSubscStatus } from '../../util/api';
import {
    timeStampToDate,
    priceStr,
    priceStrToInt,
    rangeTimeMonthStr,
} from '../../util/localeStrings';

export default class AdminPackageSubscItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: undefined,
        };

        this.getOrder();
    }

    getOrder = async () => {
        const res = await getPackageSubscByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState({
                order: res.data,
            });
        }
    };

    editStatus = async (event) => {
        const target = event.target;
        const value = target.value;
        const res = await changeSubscStatus(this.state.order.id, value);

        if (res.status === 200) {
            this.getOrder();
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.order !== nState.order) {
            return true;
        }

        return true;
    }

    render() {
        const order = this.state.order;
        return order ? (
            <div className="flex flex-col">
                <div className="p-4 flex flex-col text-green-500 border border-green-500">
                    <div className="mb-6 text-2xl">구독 정보</div>
                    <div className="w-full flex flex-row justify-between">
                        <OrderStatus order={order} onChange={this.editStatus} />
                    </div>
                </div>
                <div className="mb-2 flex flex-row justify-between items-stretch">
                    <UserInfo user={order.user} />
                    <ShipmentInfo order={order} />
                </div>
                <div className="p-4 mb-2 border border-green-500">
                    <PaymentInfo order={order} />
                </div>
                <div className="p-4 flex flex-col text-green-500 border border-green-500">
                    <div className="mb-6 text-2xl">생성된 주문</div>
                    <div className="w-full flex flex-row justify-between">
                        <table className="w-full p-4">
                            <tbody>
                                <tr className="w-full h-16 flex flex-row justify-between text-green-500 border-b border-green-500">
                                    <th className="text-xl self-center font-normal">패키지 이름</th>
                                    <th className="text-xl self-center font-normal">배송 상태</th>
                                    <th className="text-xl self-center font-normal">주문 번호</th>
                                    <th className="text-xl self-center font-normal">주문 일자</th>
                                </tr>
                                {order.packageHistories.map((p, index) => {
                                    return (
                                        <tr className="w-full h-16 flex flex-row justify-between text-green-500 border-b border-green-500">
                                            <th className="text-xl self-center font-normal">
                                                <Link to={'/package/history/' + p.id}>
                                                    {p.package ? p.package.title : '꾸러미 미정'}
                                                </Link>
                                            </th>
                                            <th className="text-xl self-center font-normal">
                                                {p.transactionStatus}
                                            </th>
                                            <th className="text-xl self-center font-normal">
                                                <Link to={'/package/history/' + p.id}>
                                                    {p.orderNum}
                                                </Link>
                                            </th>
                                            <th className="text-xl self-center font-normal">
                                                {p.purchaseDate}
                                            </th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-xl text-green-500">loading</div>
        );
    }
}

function OrderStatus(props) {
    const order = props.order;
    const orderDate = timeStampToDate(order.createdAt);

    return (
        <div className="w-50% h-full mb-6 flex flex-col text-green-500">
            <InfoItem title="구독일자" contents={orderDate} mb={true} />
            <InfoItem title="구독번호" contents={order.orderNum} mb={true} />
            <StatusSelector value={order.subscStatus} onChange={props.onChange} />
            <InfoItem title="구독 개월" contents={'3개월'} mb={true} />
            <InfoItem
                title="구독 기간"
                contents={rangeTimeMonthStr(order.packagePeriod)}
                mb={true}
            />
            <InfoItem title="구독료" contents={priceStr(order.totalPrice) + '원'} mb={false} />
        </div>
    );
}

function InfoItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <div className="col-start-1 col-end-3 text-xl">{props.title}</div>
            <div className="col-start-3 col-end-13 text-xl">{props.contents}</div>
        </div>
    );
}

function InputItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <label className="col-start-1 col-end-3 text-xl">{props.title}</label>
            <input
                disabled={props.disabled}
                className={`pl-2 col-start-4 col-end-13 text-xl border border-green-500 ${
                    props.disabled ? 'bg-purple-500' : 'bg-white'
                }`}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}

function UserInfo(props) {
    const user = props.user;
    const address = user.address[0];

    return (
        <div className="w-49% h-auto mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 text-2xl">구매자 정보</div>
            <InputItem title="이름" value={user.name} mb={true} />
            <InputItem title="우편번호" value={address.zip} mb={true} disabled={true} />
            <InputItem title="주소" value={address.addressA} mb={true} disabled={true} />
            <InputItem title="" value={address.addressB} mb={true} />
            <InputItem title="연락처" value={user.phone} mb={true} />
            <InputItem title="E-MAIL" value={user.email} mb={false} />
        </div>
    );
}

function ShipmentInfo(props) {
    const order = props.order;

    return (
        <div className="w-49% h-auto mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 text-2xl">배송지 정보</div>
            <InputItem title="이름" value={order.name} mb={true} />
            <InputItem title="우편번호" value={order.zip} mb={true} disabled={true} />
            <InputItem title="주소" value={order.addressA} mb={true} disabled={true} />
            <InputItem title="" value={order.addressB} mb={true} />
            <InputItem title="연락처" value={order.user.phone} mb={false} />
        </div>
    );
}

function PaymentInfo(props) {
    const order = props.order;
    const itemsPrice =
        priceStrToInt(priceStr(order.totalPrice)) - priceStrToInt(priceStr(order.creditUse));

    return (
        <div className="w-full h-full flex flex-col text-green-500">
            <div className="mb-12 text-2xl">결제 정보</div>
            <InfoItem title="상품 금액" contents={priceStr(order.totalPrice) + '원'} mb={true} />
            <InfoItem title="적립금 사용" contents={priceStr(order.creditUse) + '원'} mb={true} />
            <InfoItem title="할인 금액" contents={priceStr(order.creditUse) + '원'} mb={true} />
            <InfoItem title="결제 금액" contents={itemsPrice.toLocaleString() + '원'} mb={true} />
        </div>
    );
}

function StatusSelector(props) {
    return (
        <div className="mb-4 grid grid-cols-12">
            <div className="col-start-1 col-end-3 text-xl">구독 상태</div>
            <select className="col-start-4 col-end-7" value={props.value} onChange={props.onChange}>
                <option value="">상태 선택</option>
                <option value="구독중">구독중</option>
                <option value="구독만료">구독만료</option>
                <option value="구독취소">구독취소</option>
            </select>
        </div>
    );
}
