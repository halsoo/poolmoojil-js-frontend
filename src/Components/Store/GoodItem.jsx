import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ReturnAndRefundPolicy from './ReturnAndRefundPolicy';

import { getGoodByID } from '../../util/api';
import { priceStr } from '../../util/localeStrings';
import { cartInTry } from '../../actions';

class GoodItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            good: undefined,
            quantity: 1,
        };

        this.getInfo();
    }

    getInfo = async () => {
        const res = await getGoodByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState({
                good: res.data,
            });
        }
    };

    handleQuantity = (e) => {
        const target = e.target;
        const value = parseInt(target.value);

        this.setState({
            quantity: value,
        });
    };

    render() {
        const good = this.state.good;
        return good ? (
            <div className="flex flex-col">
                <div className="p-4 flex flex-row justify-between border border-green-500">
                    <div className="w-50% h-auto flex justify-center">
                        <div className="w-90% my-auto">
                            <img
                                className="w-full border border-green-500"
                                src={good.mainImg.link}
                                alt=""
                            />
                        </div>
                    </div>

                    <div className="w-50% h-auto p-4 flex flex-col">
                        <GoodItemGeneralDesc
                            good={good}
                            value={this.state.quantity}
                            onChange={this.handleQuantity}
                        />
                        {!this.props.logged.status ? (
                            <ButtonLogin />
                        ) : (
                            <ButtonGroup
                                cartOnClick={() =>
                                    this.props.cartInTry({
                                        id: good.id,
                                        category: 'good',
                                        quantity: this.state.quantity,
                                    })
                                }
                            />
                        )}
                    </div>
                </div>
                <GoodItemInfo good={good} />
                <GoodItemDetailDesc body={good.desc} />
                <GoodAdditionalImages images={good.additionalImg} />
                <ReturnAndRefundPolicy />
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cart: state.cart,
});

const MapDispatchToProps = { cartInTry };

export default connect(MapStateToProps, MapDispatchToProps)(GoodItem);

function GoodItemGeneralDesc(props) {
    const good = props.good;

    const price = good.price ? priceStr(good.price) : null;

    return (
        <div className="w-full h-full p-4 flex flex-col justify-between text-green-500">
            <div>
                <p className="text-3xl mb-4">{good.name}</p>
                <p className="text-3xl mb-4">{price}원</p>
            </div>

            <div className="flex flex-col">
                <p className="text-xl mb-6">
                    배송비: 3,000원 (30,000원 이상 구매시 무료 / 제주 추가 3,000원, 제주 외 도서지역
                    추가 4,000원)
                </p>
                <div className="flex flex-row">
                    <label className="text-xl mr-16">수량</label>
                    <input
                        className="w-20 pl-4 text-xl border border-green-500"
                        type="number"
                        value={props.value}
                        onChange={props.onChange}
                        min="1"
                        step="1"
                    ></input>
                </div>
            </div>
        </div>
    );
}

function ButtonLogin(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button className="w-full h-18 text-white text-2xl bg-green-500" name="needLogin">
                <Link to="/login">구입하려면 로그인</Link>
            </button>
        </div>
    );
}

function ButtonGroup(props) {
    return (
        <div className="mt-2 flex flex-col justify-between">
            <div className="mb-2 flex flex-row justify-between">
                <Link
                    className="w-49% h-18 flex justify-center text-2xl text-green-500 border border-green-500"
                    to="/cart"
                >
                    <button className="m-auto" onClick={props.cartOnClick}>
                        구매
                    </button>
                </Link>

                <button
                    className="w-49% h-18 text-2xl text-white bg-green-500"
                    onClick={props.cartOnClick}
                >
                    장바구니 추가
                </button>
            </div>
        </div>
    );
}

function GoodItemInfo(props) {
    const good = props.good;
    const maker = good.maker ? good.maker : '';
    const type = good.type ? good.type : '';
    const dimensions = good.dimensions ? good.dimensions + 'mm' : '';
    const color = good.color ? good.color : '';
    const designer = good.designer ? good.designer : '';
    return (
        <div className="mt-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="text-2xl mb-10">품목 정보</div>
            <InfoItem title="타입" contents={type} />
            <InfoItem title="제작" contents={maker} />
            <InfoItem title="디자이너" contents={designer} />
            <InfoItem title="크기" contents={dimensions} />
            <InfoItem title="컬러" contents={color} />
        </div>
    );
}

function InfoItem(props) {
    return (
        <div className="grid grid-cols-12 mb-2">
            <div className="col-start-1 col-end-2 text-xl">{props.title}</div>
            <div className="col-start-3 col-end-13 text-xl">{props.contents}</div>
        </div>
    );
}

function GoodItemDetailDesc(props) {
    const body = props.body.split(/\r\n|\r|\n/);
    return (
        <div className="mt-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="text-2xl mb-10">굿즈 소개</div>
            {body.map((para, index) => {
                const mb = index === body.length - 1 ? false : true;
                return (
                    <p className={`${mb ? 'mb-6' : 'mb-0'} lg:text-xl sm:text-4xl`} key={index}>
                        {para}
                    </p>
                );
            })}
        </div>
    );
}

function GoodAdditionalImages(props) {
    const images = props.images;
    return (
        <div className="mt-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="text-2xl mb-10">상세 이미지</div>
            {images
                ? images.map((img, index) => {
                      const mb = index === images.length - 1 ? false : true;
                      return (
                          <img
                              className={`${mb ? 'mb-2' : 'mb-0'} w-full h-auto`}
                              key={index}
                              src={img.link}
                              alt=""
                          />
                      );
                  })
                : null}
        </div>
    );
}
