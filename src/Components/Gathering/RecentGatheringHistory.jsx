import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { getGatheringHistoryByOrderNum } from '../../util/api';
import { timeStampToDate, priceStr, priceStrToInt, oneTimeDateStr } from '../../util/localeStrings';
import { gatheringHistoryOut } from '../../actions';

class RecentPackageHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: undefined,
        };

        this.getOrder();
    }

    getOrder = async () => {
        const res = await getGatheringHistoryByOrderNum(this.props.order.gatheringID);

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
        this.props.gatheringHistoryOut();
    }

    render() {
        const order = this.state.order;
        return this.props.order.gatheringID ? (
            order ? (
                <div className="flex flex-col">
                    <div className="p-4 flex flex-col text-green-500 border border-green-500">
                        <div className="mb-6 lg:text-2xl sm:text-5xl">모임 예약 정보</div>
                        <div className="w-full flex flex-row justify-between">
                            <OrderStatus order={order} />
                            <button className="w-25% h-16 self-center bg-green-500 lg:text-2xl sm:text-5xl text-white">
                                예약 취소
                            </button>
                        </div>
                    </div>
                    <div className="mb-2 flex flex-row justify-between items-stretch">
                        <UserInfo user={order.user} />
                    </div>
                    <div className="p-4 border border-green-500">
                        <PaymentInfo order={order} />
                    </div>
                </div>
            ) : (
                <div className="lg:text-xl sm:text-5xl text-green-500">loading</div>
            )
        ) : (
            <Redirect to="/gathering" />
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    order: state.order,
});

const MapDispatchToProps = { gatheringHistoryOut };

export default connect(MapStateToProps, MapDispatchToProps)(RecentPackageHistory);

function OrderStatus(props) {
    const order = props.order;
    const purchaseDate = oneTimeDateStr(order.purchaseDate);
    const bookDate = oneTimeDateStr(order.date);
    const bookPrice = priceStr(order.totalPrice);

    return (
        <div className="w-50% h-full mb-6 flex flex-col text-green-500">
            <InfoItem title="예약일자" contents={purchaseDate} mb={true} />
            <InfoItem title="예약번호" contents={order.orderNum} mb={true} />
            <InfoItem title="모임 정보" contents={order.gathering.title} mb={true} />
            <InfoItem title="일시" contents={bookDate} mb={true} />
            <InfoItem title="장소" contents={order.gathering.place.name} mb={true} />
            <InfoItem title="참가인원" contents={order.headCount} mb={true} />
            <InfoItem title="예약비" contents={bookPrice + '원'} mb={false} />
        </div>
    );
}

function InfoItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <div className="col-start-1 col-end-3 lg:text-xl sm:text-5xl">{props.title}</div>
            <div className="col-start-4 col-end-13 lg:text-xl sm:text-5xl">{props.contents}</div>
        </div>
    );
}

function InputItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <label className="col-start-1 col-end-3 lg:text-xl sm:text-5xl">{props.title}</label>
            <input
                disabled={props.disabled}
                className={`pl-2 col-start-4 col-end-13 lg:text-xl sm:text-5xl border border-green-500 ${
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
        <div className="w-full h-auto mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 lg:text-2xl sm:text-5xl">참가자 정보</div>
            <InfoItem title="이름" contents={user.name} mb={true} />
            <InfoItem title="연락처" contents={user.phone} mb={true} />
            <InfoItem title="E-MAIL" contents={user.email} mb={false} />
        </div>
    );
}

function PaymentInfo(props) {
    const order = props.order;
    const itemsPrice =
        priceStrToInt(priceStr(order.totalPrice)) - priceStrToInt(priceStr(order.creditUse));

    return (
        <div className="w-full h-full flex flex-col text-green-500">
            <div className="mb-12 lg:text-2xl sm:text-5xl">결제 정보</div>
            <InfoItem title="상품 금액" contents={priceStr(order.totalPrice) + '원'} mb={true} />
            <InfoItem title="적립금 사용" contents={priceStr(order.creditUse) + '원'} mb={true} />
            <InfoItem title="할인 금액" contents={priceStr(order.creditUse) + '원'} mb={true} />
            <InfoItem title="결제 금액" contents={itemsPrice.toLocaleString() + '원'} mb={true} />
        </div>
    );
}
