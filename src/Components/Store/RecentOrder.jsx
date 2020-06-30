import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { getOrderHistoryByOrderNum, cancelOrder } from '../../util/api';
import { timeStampToDate, priceStr, priceStrToInt } from '../../util/localeStrings';
import { TryCartClear, orderOut } from '../../actions';

class RecentOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: undefined,
        };

        this.getOrder();
    }

    getOrder = async () => {
        const res = await getOrderHistoryByOrderNum(this.props.order.orderNum);
        if (res.status === 200) {
            this.setState({
                order: res.data,
            });
        }
    };

    cancel = async () => {
        const res = await cancelOrder(this.state.order.orderNum);

        if (res.status === 200) {
            window.location.reload(false);
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.order !== nState.order) {
            return true;
        }

        return true;
    }

    componentWillUnmount() {
        this.props.TryCartClear();
        this.props.orderOut();
    }

    render() {
        const order = this.state.order;
        return this.props.order.orderNum ? (
            order ? (
                <div className="flex flex-col">
                    <div className="p-4 flex flex-col text-green-500 border border-green-500">
                        <div className="mb-6 text-2xl">주문 정보</div>
                        <div className="w-full flex flex-row justify-between">
                            <OrderStatus order={order} />
                            <button
                                onClick={this.cancel}
                                className="w-25% h-16 self-center bg-green-500 text-2xl text-white"
                            >
                                주문 취소
                            </button>
                        </div>
                        <ItemList order={order} />
                        <TotalPrice totalPrice={order.totalPrice} shipping={order.shippingFee} />
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

const MapDispatchToProps = { TryCartClear, orderOut };

export default connect(MapStateToProps, MapDispatchToProps)(RecentOrder);

function OrderStatus(props) {
    const order = props.order;
    const orderDate = timeStampToDate(order.createdAt);

    return (
        <div className="w-50% h-full mb-6 flex flex-col text-green-500">
            <InfoItem title="주문일자" contents={orderDate} mb={true} />
            <InfoItem title="주문번호" contents={order.orderNum} mb={true} />
            <InfoItem title="진행상태" contents={order.transactionStatus} mb={false} />
        </div>
    );
}

function ItemList(props) {
    const order = props.order;
    const cart = order.cart;
    const books = order.books;
    const goods = order.goods;

    return (
        <div className="w-full mb-12 flex flex-col">
            <table className="">
                <tbody>
                    <tr className="h-16 text-green-500 border-b border-green-500">
                        <th className="w-60% text-xl text-left font-normal">상품 정보</th>
                        <th className="w-20% text-xl font-normal">수량</th>
                        <th className="w-20% text-xl font-normal">가격</th>
                    </tr>
                    {Object.keys(cart).map((id, index) => {
                        const item =
                            cart[id].category === 'book'
                                ? books.find((o) => o.id === id)
                                : goods.find((o) => o.id === id);

                        return (
                            <tr className="text-green-500 border-b border-green-500" key={index}>
                                <th className="text-left font-normal">
                                    <div className="py-4 flex flex-row">
                                        {item.mainImg ? (
                                            <img className="w-20% mr-6" src={item.mainImg.link} />
                                        ) : (
                                            <div className="w-20% mr-6" />
                                        )}
                                        <div className="my-auto text-xl">
                                            {item.name ? item.name : item.title}
                                        </div>
                                    </div>
                                </th>
                                <th className="font-normal text-center">
                                    <div className="w-20 mx-auto text-xl">{cart[id].quantity}</div>
                                </th>
                                <th className="text-center font-normal">
                                    <div className="">
                                        {(
                                            priceStrToInt(priceStr(item.price)) * cart[id].quantity
                                        ).toLocaleString()}
                                        원
                                    </div>
                                </th>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function TotalPrice(props) {
    const totalPrice = props.totalPrice;
    const shipping = props.shipping;

    const totalPriceInt = priceStrToInt(priceStr(totalPrice));
    const shippingInt = priceStrToInt(priceStr(shipping));

    return (
        <div className="w-full flex flex-col">
            <div className="w-50% ml-auto flex flex-col text-xl border-b border-green-500">
                <div className="mb-4 flex flex-row justify-between">
                    <div>상품 합계</div>
                    <div className="text-right">{priceStr(totalPrice)}원</div>
                </div>
                <div className="mb-4 flex flex-row justify-between">
                    <div>배송비</div>
                    <div className="text-right">{priceStr(shipping)}원</div>
                </div>
            </div>
            <div className="w-50% mt-4 ml-auto flex flex-row justify-between text-xl">
                <div>합계</div>
                <div className="text-right">{(totalPriceInt + shippingInt).toLocaleString()}원</div>
            </div>
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
            <InputItem title="연락처" value={order.user.phone} mb={true} />
            <InputItem title="E-MAIL" value={order.user.email} mb={false} />
        </div>
    );
}

function PaymentInfo(props) {
    const order = props.order;
    const itemsPrice =
        priceStrToInt(priceStr(order.totalPrice)) -
        priceStrToInt(priceStr(order.creditUse)) +
        priceStrToInt(priceStr(order.shippingFee));

    return (
        <div className="w-full h-full flex flex-col text-green-500">
            <div className="mb-12 text-2xl">결제 정보</div>
            <InfoItem title="상품 금액" contents={priceStr(order.totalPrice) + '원'} mb={true} />
            <InfoItem title="적립금 사용" contents={priceStr(order.creditUse) + '원'} mb={true} />
            <InfoItem title="할인 금액" contents={priceStr(order.creditUse) + '원'} mb={true} />
            <InfoItem title="배송비" contents={priceStr(order.shippingFee) + '원'} mb={true} />
            <InfoItem title="결제 금액" contents={itemsPrice.toLocaleString() + '원'} mb={true} />
        </div>
    );
}
