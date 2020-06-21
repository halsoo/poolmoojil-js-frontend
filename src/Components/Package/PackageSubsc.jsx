import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NewWindow from 'react-new-window';

import { getUserCookie } from '../../util/api';
import {
    priceStr,
    priceStrToInt,
    dateToTime,
    oneTimeMonthStr,
    plusSixMonths,
} from '../../util/localeStrings';
import { islandAndMountainousArea, jejuArea } from '../../util/extraFee';

import AddressSearch from '../shared/AddressSearch';
import ButtonOne from '../shared/ButtonOne';

class PackageSubsc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            package: this.props.package,
            quantity: 1,
            creditUse: 0,
            payOption: undefined,
            popup: false,
            shipInfo: {
                name: '',
                zip: '',
                addressA: '',
                addressB: '',
                phone: '',
            },
            shippingFee: 0,
        };

        this.getUser();
    }

    getUser = async () => {
        const res = await getUserCookie();
        if (res.status === 200) {
            this.setState({
                user: res.data,
            });
        }
    };

    handleQuantity = (e) => {
        const target = e.target;
        let value = target.value;

        this.setState({
            quantity: value,
        });
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
                    phone: user.phone,
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

    handleInfo = () => {
        const singlePackage = this.state.package;

        const price = priceStr(singlePackage.price);
        const priceInt = priceStrToInt(price);
        const date = oneTimeMonthStr(singlePackage.date);
        const time = dateToTime(singlePackage.date);
        const sixMonthLater = plusSixMonths(singlePackage.date);

        return {
            price: price,
            priceInt: priceInt,
            date: date,
            time: time,
            sixMonthLater: sixMonthLater,
        };
    };

    calcShipping = () => {
        if (islandAndMountainousArea.includes(this.state.shipInfo.zip)) {
            return 7000;
        } else if (jejuArea.includes(this.state.shipInfo.zip)) {
            return 6000;
        } else if (!this.props.isOnce) {
            return 0;
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
        const singlePackage = this.state.package;
        const user = this.state.user;
        const info = singlePackage ? this.handleInfo() : null;
        return singlePackage && user ? (
            <div className="flex flex-col">
                <PackageInfo
                    isOnce={this.props.isOnce}
                    package={singlePackage}
                    info={info}
                    onChange={this.handleQuantity}
                    headCount={this.state.quantity}
                />

                <div className="mt-2 p-4 flex flex-col text-green-500 border border-green-500">
                    <div className="lg:text-2xl sm:text-6xl mb-10">배송/교환/반품 안내</div>
                    <div className="mb-4">
                        <p className="mb-2 lg:text-2xl sm:text-6xl">
                            반품/교환 사유에 따른 요청 가능 기간
                        </p>
                        <p className="lg:text-xl sm:text-5xl">
                            1. 구매자 단순 변심은 상품 수령 후 7일 이내
                        </p>
                        <p className="lg:text-xl sm:text-5xl">
                            2. 표시/광고와 상이, 상품 하자의 경우 상품 수령 후 3개월 이내 혹은
                            표시/광고와 다른 사실을 안 날로부터 30일 이내. 둘 중 하나 경과 시
                            반품/교환 불가
                        </p>
                    </div>
                    <div className="">
                        <p className="mb-2 lg:text-2xl sm:text-6xl">반품/교환 불가능 사유</p>
                        <p className="lg:text-xl sm:text-5xl">1. 반품 요청 기간이 지난 경우</p>
                        <p className="lg:text-xl sm:text-5xl">
                            2. 구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우 (단, 상품의
                            내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외)
                        </p>
                        <p className="lg:text-xl sm:text-5xl">
                            3. 구매자의 책임 있는 사유로 포장이 훼손되어 상품 가치가 현저히 상실된
                            경우
                        </p>
                        <p className="lg:text-xl sm:text-5xl">
                            4. 구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한
                            경우
                        </p>
                        <p className="lg:text-xl sm:text-5xl">
                            5. 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히
                            감소한 경우
                        </p>
                        <p className="lg:text-xl sm:text-5xl">
                            6. 고객의 요청사항에 맞춰 제작에 들어가는 맞춤제작상품의 경우
                        </p>
                        <p className="lg:text-xl sm:text-5xl">
                            7. 복제 가능한 상품 등의 포장을 훼손한 경우
                        </p>
                    </div>
                </div>

                <SubscInfo
                    package={singlePackage}
                    quantity={this.state.quantity}
                    info={info}
                    isOnce={this.props.isOnce}
                />
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
                        isOnce={this.props.isOnce}
                        quantity={this.state.quantity}
                        info={info}
                        shipping={this.state.shippingFee}
                        inputValue={this.state.creditUse}
                        inputOnChange={this.handleDiscount}
                        selectValue={this.state.payOption}
                        selectOnChange={this.handlePayOption}
                    />

                    <ButtonOne
                        history={this.props.history}
                        pg={this.state.payOption}
                        price={info.priceInt * (this.props.isOnce ? this.state.quantity : 3)}
                        user={this.state.user}
                        package={singlePackage}
                        origin={this.props.isOnce ? 'package_onetime' : 'package_sixtime'}
                        creditUse={this.state.creditUse}
                        shipInfo={this.state.shipInfo}
                        shippingFee={this.state.shippingFee}
                        creditUse={this.state.creditUse}
                    />
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
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(PackageSubsc);

function PackageInfo(props) {
    const singlePackage = props.package;

    return (
        <div className="w-full h-full p-4 grid grid-cols-12 border border-green-500">
            <div className="mr-6 col-start-1 col-end-4 border border-green-500">
                <img className="w-full" src={singlePackage.mainImg.link} alt="img" />
            </div>
            <div className="col-start-4 col-end-13 flex flex-col justify-around text-green-500">
                {props.isOnce ? (
                    <Link className="lg:text-2xl sm:text-5xl" to={`/package/${singlePackage.id}`}>
                        {singlePackage.title}
                    </Link>
                ) : (
                    <p className="lg:text-2xl sm:text-5xl">꾸러미 구독하기</p>
                )}

                {props.isOnce ? (
                    <div className="flex flex-row">
                        <label className="lg:text-xl sm:text-4xl mr-16">수량</label>
                        <input
                            className="w-20 pl-4 lg:text-xl sm:text-4xl border border-green-500"
                            onChange={props.onChange}
                            value={props.headCount}
                            type="number"
                            min="1"
                            step="1"
                        ></input>
                    </div>
                ) : (
                    <div className="flex flex-row">
                        <div className="lg:text-xl sm:text-4xl mr-16">구독 개월</div>
                        <div className="lg:text-xl sm:text-4xl">3개월</div>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <div className="col-start-1 col-end-3 lg:text-xl sm:text-4xl">{props.title}</div>
            <div className="col-start-3 col-end-13 lg:text-xl sm:text-4xl">{props.contents}</div>
        </div>
    );
}

function SubscInfo(props) {
    const { priceInt, date, sixMonthLater } = props.info;
    const quantity = props.isOnce ? props.quantity : 3;

    const range =
        date +
        ' ~ ' +
        sixMonthLater.year.toString() +
        '년 ' +
        (sixMonthLater.month < 10
            ? '0' + sixMonthLater.month.toString()
            : sixMonthLater.month.toString()) +
        '월';
    return (
        <div className="w-full h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 lg:text-2xl sm:text-5xl">
                {props.isOnce ? '구매 정보' : '구독 정보'}
            </div>
            {props.isOnce ? (
                <InfoItem title="수량" contents={quantity + '개'} mb={true} />
            ) : (
                <InfoItem title="구독 개월" contents="3개월" mb={true} />
            )}
            {props.isOnce ? null : <InfoItem title="구독 기간" contents={range} mb={true} />}

            <InfoItem
                title={props.isOnce ? '가격' : '구독료'}
                contents={(priceInt * quantity).toLocaleString() + '원'}
                mb={false}
            />
        </div>
    );
}

function SearchInputItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <label className="col-start-1 col-end-3 lg:text-xl sm:text-4xl">{props.title}</label>
            <input
                className={`pl-2 col-start-4 col-end-10 lg:text-xl sm:text-4xl border border-green-500 ${
                    props.disabled ? 'bg-purple-500' : 'bg-white'
                }`}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
            />
            <button
                className="col-start-11 col-end-13 h-full lg:text-lg sm:text-4xl bg-green-500 text-white"
                type="button"
                onClick={props.onClick}
            >
                검색
            </button>
        </div>
    );
}

function InputItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <label className="col-start-1 col-end-3 lg:text-xl sm:text-4xl">{props.title}</label>
            <input
                disabled={props.disabled}
                className={`pl-2 col-start-4 col-end-13 lg:text-xl sm:text-4xl border border-green-500 ${
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
            <div className="mb-12 lg:text-2xl sm:text-5xl">구매자 정보</div>
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
    const shipInfo = props.shipInfo;

    return (
        <div className="w-49% h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="flex flex-row justify-between">
                <div className="mb-12 lg:text-xl sm:text-4xl">배송지 정보</div>
                <div className="sm:text-4xl flex flex-row">
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
                title="연락처"
                value={shipInfo.phone}
                name="phone"
                mb={false}
                onChange={props.onChange}
            />
        </div>
    );
}

function PaymentInfo(props) {
    const user = props.user;
    const { priceInt } = props.info;
    const quantity = props.isOnce ? props.quantity : 3;

    return (
        <div className="w-full h-auto flex flex-col text-green-500">
            <div className="mb-12 lg:text-2xl sm:text-5xl">결제 정보</div>
            <InfoItem
                title="총합 금액"
                contents={(priceInt * quantity).toLocaleString() + '원'}
                mb={true}
            />
            <div className="mb-4 grid grid-cols-12">
                <div className="col-start-1 col-end-3 lg:text-xl sm:text-4xl">적립금 사용</div>
                <div className="col-start-3 col-end-13 flex flex-row lg:text-xl sm:text-4xl">
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
            {props.isOnce ? (
                <InfoItem
                    title="배송비"
                    contents={props.shipping.toLocaleString() + '원'}
                    mb={true}
                />
            ) : null}
            <InfoItem
                title="결제 금액"
                contents={
                    (priceInt * quantity - props.inputValue + props.shipping).toLocaleString() +
                    '원'
                }
                mb={true}
            />

            <div className="mb-12 grid grid-cols-12">
                <div className="col-start-1 col-end-3 lg:text-xl sm:text-4xl">결제 방법</div>
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
