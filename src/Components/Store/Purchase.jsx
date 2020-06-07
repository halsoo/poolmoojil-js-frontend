import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NewWindow from 'react-new-window';

import { getBookByID, getGoodByID, getUserCookie } from '../../util/api';
import { priceStr, priceStrToInt } from '../../util/localeStrings';
import { islandAndMountainousArea, jejuArea } from '../../util/extraFee';
import { cartClear } from '../../actions';
import AddressSearch from '../shared/AddressSearch';

class Purchase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: this.props.cart,
            cartInfo: undefined,
            user: undefined,
            creditUse: 0,
            payOption: undefined,
            popup: false,
            shipInfo: {
                name: '',
                zip: '',
                addressA: '',
                addressB: '',
                email: '',
            },
            shippingFee: 0,
        };

        this.getItems();
        this.getUser();
    }

    getItems = async () => {
        const cart = this.state.cart;
        let res = null;
        let cartInfo = {};
        for (const id in cart) {
            if (cart[id].category === 'book') res = await getBookByID(id);
            else res = await getGoodByID(id);
            cartInfo[id] = res.data;
        }

        this.setState({
            cartInfo: cartInfo,
        });
    };

    getUser = async () => {
        const res = await getUserCookie();
        if (res.status === 200) {
            this.setState({
                user: res.data,
            });
        }
    };

    handleShipInfo = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState(
            {
                shipInfo: {
                    ...this.state.shipInfo,
                    [name]: value,
                },
            },
            () => {
                const shipping = this.calcShipping();
                this.setState({
                    shippingFee: shipping,
                });
            },
        );
    };

    sameAsBuyer = () => {
        const user = this.state.user;
        const address = user.address[0];

        this.setState(
            {
                shipInfo: {
                    name: user.name,
                    zip: address.zip,
                    addressA: address.addressA,
                    addressB: address.addressB,
                    email: user.email,
                },
            },
            () => {
                const shipping = this.calcShipping();
                this.setState({
                    shippingFee: shipping,
                });
            },
        );
    };

    handleDiscount = (e) => {
        const target = e.target;
        let value = target.value;
        value = parseInt(value);

        if (value < this.state.user.credit) {
            this.setState({
                creditUse: value,
            });
        } else {
            this.setState({
                creditUse: this.state.user.credit,
            });
        }
    };

    handlePayOption = (e) => {
        const target = e.target;
        let value = target.value;

        this.setState({
            payOption: value,
        });
    };

    handlePopUp = () => {
        this.setState({
            popup: true,
        });
    };

    calcShipping = () => {
        if (islandAndMountainousArea.includes(this.state.shipInfo.zip)) {
            return 7000;
        } else if (jejuArea.includes(this.state.shipInfo.zip)) {
            return 6000;
        } else {
            return 3000;
        }
    };

    componentDidMount() {
        window.addEventListener(
            'message',
            (event) => {
                if (event.data.zipCode) {
                    this.setState(
                        {
                            shipInfo: {
                                ...this.state.shipInfo,
                                zip: event.data.zipCode,
                                addressA: event.data.addressA,
                            },
                        },
                        () => {
                            const shipping = this.calcShipping();
                            this.setState({
                                shippingFee: shipping,
                            });
                        },
                    );
                }
            },
            false,
        );
    }

    render() {
        const cart = this.state.cart;
        const cartInfo = this.state.cartInfo;
        const user = this.state.user;
        return cartInfo && user ? (
            <div className="flex flex-col">
                <div className="p-4 flex flex-col text-green-500 border border-green-500">
                    <div className="mb-12 text-2xl">주문/결제</div>
                    <ItemList cart={cart} cartInfo={cartInfo} />
                    <TotalPrice cart={cart} cartInfo={cartInfo} shipping={this.state.shippingFee} />
                </div>
                <div className="mb-2 flex flex-row justify-between">
                    <UserInfo user={user} />
                    <ShipmentInfo
                        user={user}
                        shipInfo={this.state.shipInfo}
                        onClick={this.handlePopUp}
                        onChange={this.handleShipInfo}
                        checkOnChange={this.sameAsBuyer}
                    />
                </div>
                <div className="mt-2 p-4 border border-green-500">
                    <PaymentInfo
                        user={user}
                        cart={cart}
                        cartInfo={cartInfo}
                        shipping={this.state.shippingFee}
                        inputValue={this.state.creditUse}
                        inputOnChange={this.handleDiscount}
                        selectValue={this.state.payOption}
                        selectOnChange={this.handlePayOption}
                    />

                    <ButtonOne />
                </div>

                {this.state.popup ? (
                    <NewWindow
                        name="popup"
                        center="screen"
                        onUnload={() => this.setState({ popup: false })}
                        features={{ width: 570, height: 450 }}
                    >
                        <AddressSearch />
                    </NewWindow>
                ) : null}
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cart: state.cart,
});

const MapDispatchToProps = { cartClear };

export default connect(MapStateToProps, MapDispatchToProps)(Purchase);

function ItemList(props) {
    const cart = props.cart;
    const cartInfo = props.cartInfo;
    return (
        <div className="w-full mb-12 flex flex-col">
            <table className="">
                <tbody>
                    <tr className="h-16 text-green-500 border-b border-green-500">
                        <th className="w-60% text-xl text-left font-normal">상품 정보</th>
                        <th className="w-20% text-xl font-normal">수량</th>
                        <th className="w-20% text-xl font-normal">가격</th>
                    </tr>
                    {Object.keys(props.cart).map((id, index) => (
                        <tr className="text-green-500 border-b border-green-500" key={index}>
                            <th className="text-left font-normal">
                                <div className="py-4 flex flex-row">
                                    <img className="w-20% mr-6" src={cartInfo[id].mainImg.link} />
                                    <div className="my-auto text-xl">
                                        {cartInfo[id].name ? cartInfo[id].name : cartInfo[id].title}
                                    </div>
                                </div>
                            </th>
                            <th className="font-normal text-center">
                                <div className="w-20 mx-auto text-xl">{cart[id].quantity}</div>
                            </th>
                            <th className="text-center font-normal">
                                <div className="">
                                    {(
                                        priceStrToInt(priceStr(cartInfo[id].price)) *
                                        cart[id].quantity
                                    ).toLocaleString()}
                                    원
                                </div>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TotalPrice(props) {
    let totalPrice = 0;
    for (const id in props.cartInfo) {
        totalPrice += priceStrToInt(priceStr(props.cartInfo[id].price)) * props.cart[id].quantity;
    }

    const shipping = props.shipping;

    return (
        <div className="w-full flex flex-col">
            <div className="w-50% ml-auto flex flex-col text-xl border-b border-green-500">
                <div className="mb-4 flex flex-row justify-between">
                    <div>상품 합계</div>
                    <div className="text-right">{totalPrice.toLocaleString()}원</div>
                </div>
                <div className="mb-4 flex flex-row justify-between">
                    <div>배송비</div>
                    <div className="text-right">{shipping.toLocaleString()}원</div>
                </div>
            </div>
            <div className="w-50% mt-4 ml-auto flex flex-row justify-between text-xl">
                <div>합계</div>
                <div className="text-right">{(totalPrice + shipping).toLocaleString()}원</div>
            </div>
        </div>
    );
}

function SearchInputItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <label className="col-start-1 col-end-3 text-xl">{props.title}</label>
            <input
                className={`pl-2 col-start-4 col-end-10 text-xl border border-green-500 ${
                    props.disabled ? 'bg-purple-500' : 'bg-white'
                }`}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
            />
            <button
                className="col-start-11 col-end-13 h-full text-lg bg-green-500 text-white"
                type="button"
                onClick={props.onClick}
            >
                검색
            </button>
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
        <div className="w-49% h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 text-2xl">구매자 정보</div>
            <InputItem title="이름" value={user.name} mb={true} />
            <InputItem title="우편번호" value={address.zip} mb={true} disabled={true} />
            <InputItem title="주소" value={address.addressA} mb={true} disabled={true} />
            <InputItem title="" value={address.addressB} mb={true} />
            <InputItem title="E-MAIL" value={user.email} mb={false} />
        </div>
    );
}

function ShipmentInfo(props) {
    const user = props.user;
    const address = user.address[0];
    const shipInfo = props.shipInfo;

    return (
        <div className="w-49% h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="flex flex-row justify-between">
                <div className="mb-12 text-2xl">배송지 정보</div>
                <div className="flex flex-row">
                    <label> 주문자 정보와 동일 </label>
                    <input className="ml-4" type="checkbox" onChange={props.checkOnChange} />
                </div>
            </div>
            <InputItem
                title="이름"
                name="name"
                value={shipInfo.name}
                onChange={props.onChange}
                mb={true}
            />
            <SearchInputItem
                title="우편번호"
                value={shipInfo.zip}
                mb={true}
                disabled={true}
                name="zip"
                onChange={props.onChange}
                onClick={props.onClick}
            />
            <InputItem
                title="주소"
                value={shipInfo.addressA}
                mb={true}
                name="addressA"
                disabled={true}
                onChange={props.onChange}
            />
            <InputItem
                title=""
                value={shipInfo.addressB}
                name="addressB"
                mb={true}
                onChange={props.onChange}
            />
            <InputItem
                title="E-MAIL"
                value={shipInfo.email}
                name="email"
                mb={false}
                onChange={props.onChange}
            />
        </div>
    );
}

function PaymentInfo(props) {
    const user = props.user;
    let totalPrice = 0;
    for (const id in props.cartInfo) {
        totalPrice += priceStrToInt(priceStr(props.cartInfo[id].price)) * props.cart[id].quantity;
    }

    return (
        <div className="w-full h-full flex flex-col text-green-500">
            <div className="mb-12 text-2xl">결제 정보</div>
            <InfoItem title="상품 금액" contents={totalPrice.toLocaleString() + '원'} mb={true} />
            <div className="mb-4 grid grid-cols-12">
                <div className="col-start-1 col-end-3 text-xl">적립금 사용</div>
                <div className="col-start-3 col-end-13 flex flex-row text-xl">
                    <input
                        className="w-24 pl-2 mr-2 border border-green-500"
                        value={props.inputValue}
                        onChange={props.inputOnChange}
                    />
                    <div>원 / {user.credit.toLocaleString()}원</div>
                </div>
            </div>
            <InfoItem
                title="할인 금액"
                contents={props.inputValue.toLocaleString() + '원'}
                mb={true}
            />
            <InfoItem title="배송비" contents={props.shipping.toLocaleString() + '원'} mb={true} />
            <InfoItem
                title="결제 금액"
                contents={(totalPrice + props.shipping - props.inputValue).toLocaleString() + '원'}
                mb={true}
            />

            <div className="mb-12 grid grid-cols-12">
                <div className="col-start-1 col-end-3 text-xl">결제 방법</div>
                <select
                    className="col-start-3 col-end-5"
                    value={props.selectValue}
                    onChange={props.selectOnChange}
                >
                    <option value="">옵션 선택</option>
                    <option value="kcp">신용카드/체크카드</option>
                    <option value="kakaopay">카카오페이</option>
                </select>
            </div>
        </div>
    );
}

function ButtonOne(props) {
    return (
        <div className="w-25% mx-auto">
            <button className="w-full h-20 mx-auto text-2xl text-white bg-green-500">
                <Link>결제하기</Link>
            </button>
        </div>
    );
}
