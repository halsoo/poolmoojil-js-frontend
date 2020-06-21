import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { getPackageSubscByOrderNum } from '../../util/api';
import {
    timeStampToDate,
    priceStr,
    priceStrToInt,
    rangeTimeMonthStr,
} from '../../util/localeStrings';
import { packageSubscOut } from '../../actions';

class RecentPackageHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: undefined,
        };

        this.getOrder();
    }

    getOrder = async () => {
        const res = await getPackageSubscByOrderNum(this.props.order.packageSubscID);
        if (res.status === 200) {
            this.setState({
                order: res.data,
            });
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.order !== nState.order) {
            return true;
        }

        return true;
    }

    componentWillUnmount() {
        this.props.packageSubscOut();
    }

    render() {
        const order = this.state.order;
        return this.props.order.packageSubscID ? (
            order ? (
                <div className="flex flex-col">
                    <div className="p-4 flex flex-col text-green-500 border border-green-500">
                        <div className="mb-6 text-2xl">주문 정보</div>
                        <div className="w-full flex flex-row justify-between">
                            <OrderStatus order={order} />
                            <button className="w-25% h-16 self-center bg-green-500 text-2xl text-white">
                                구독 취소
                            </button>
                        </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between items-stretch">
                        <UserInfo user={order.user} />
                        <ShipmentInfo order={order} />
                    </div>
                    <div className="p-4 border border-green-500">
                        <PaymentInfo order={order} />
                    </div>
                </div>
            ) : (
                <div className="text-xl text-green-500">loading</div>
            )
        ) : (
            <Redirect to="/store" />
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    order: state.order,
});

const MapDispatchToProps = { packageSubscOut };

export default connect(MapStateToProps, MapDispatchToProps)(RecentPackageHistory);

function OrderStatus(props) {
    const order = props.order;
    const orderDate = timeStampToDate(order.createdAt);

    return (
        <div className="w-50% h-full mb-6 flex flex-col text-green-500">
            <InfoItem title="구독일자" contents={orderDate} mb={true} />
            <InfoItem title="구독번호" contents={order.orderNum} mb={true} />
            <InfoItem title="구독 상태" contents={order.subscStatus} mb={true} />
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
