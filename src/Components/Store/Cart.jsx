import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NewWindow from 'react-new-window';

import { getBookByID, getGoodByID, getUserCookie } from '../../util/api';
import { priceStr, priceStrToInt } from '../../util/localeStrings';
import { cartIn, cartOut } from '../../actions';
import remove from '../../img/close.png';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: this.props.cart,
            cartInfo: undefined,
            user: undefined,
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
        const res = getUserCookie();

        if (res.status === 200) {
            this.setState({
                user: res.data,
            });
        }
    };

    handleQuantity = (e) => {
        const target = e.target;
        const value = parseInt(target.value);
        const name = target.name;

        this.setState({
            cart: {
                ...this.state.cart,
                [name]: {
                    ...this.state.cart[name],
                    quantity: value,
                },
            },
        });
    };

    render() {
        const cart = this.state.cart;
        const cartInfo = this.state.cartInfo;
        return cartInfo ? (
            <div className="p-4 flex flex-col text-green-500 border border-green-500">
                <div className="mb-12 text-2xl">장바구니</div>
                <ItemList
                    cart={cart}
                    cartInfo={cartInfo}
                    onChange={this.handleQuantity}
                    onClick={cartOut}
                />
                <TotalPrice cartInfo={cartInfo} />
                <ButtonOne />
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    cart: state.cart,
});

const MapDispatchToProps = { cartOut, cartIn };

export default connect(MapStateToProps, MapDispatchToProps)(Cart);

function ItemList(props) {
    const cart = props.cart;
    const cartInfo = props.cartInfo;
    return (
        <div className="w-full mb-12 flex flex-col">
            <table className="">
                <tbody>
                    <tr className="h-16 text-green-500 border-b border-green-500">
                        <th className="w-60% text-xl text-left font-normal">상품 정보</th>
                        <th className="w-10% text-xl font-normal">수량</th>
                        <th className="w-20% text-xl font-normal">가격</th>
                        <th />
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
                            <th className="font-normal">
                                <input
                                    className="w-20 text-xl border border-green-500"
                                    type="number"
                                    name={id}
                                    value={cart[id].quantity}
                                    onChange={props.onChange}
                                    min="1"
                                    step="1"
                                ></input>
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
                            <th className="text-left font-normal">
                                <button onClick={() => props.onClick(id)}>
                                    <img className="w-20% mx-auto" src={remove} />
                                </button>
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
        totalPrice += priceStrToInt(priceStr(props.cartInfo[id].price));
    }

    const shipping = 3000;

    return (
        <div className="w-full flex flex-col">
            <div className="w-50% ml-auto flex flex-col text-xl border-b border-green-500">
                <div className="flex flex-row justify-between">
                    <div>상품 합계</div>
                    <div className="text-right">{totalPrice.toLocaleString()}원</div>
                </div>
                <div className="flex flex-row justify-around">
                    <div>배송비</div>
                    <div className="text-right">{shipping.toLocaleString()}원</div>
                </div>
            </div>
            <div className="w-50% ml-auto flex flex-row justify-between text-xl">
                <div>합계</div>
                <div className="text-right">{(totalPrice + shipping).toLocaleString()}원</div>
            </div>
        </div>
    );
}

function ButtonOne(props) {
    return (
        <div className="w-25% mx-auto">
            <button className="w-full h-20 mx-auto text-2xl text-white bg-green-500">
                <Link to={'/store/purchase'}> 주문하기 </Link>
            </button>
        </div>
    );
}
