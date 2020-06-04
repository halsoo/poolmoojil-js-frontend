import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NewWindow from 'react-new-window';

import { getUserCookie } from '../../util/api';
import {
    priceStr,
    rangeDateStr,
    oneTimeDateStr,
    timeStr,
    nextWeekDay,
    convertDayToKor,
    priceStrToInt,
    dateToTime,
    oneTimeMonthStr,
    plusSixMonths,
} from '../../util/localeStrings';

import AddressSearch from '../shared/AddressSearch';

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
                email: '',
            },
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

        this.setState({
            shipInfo: {
                ...this.state.shipInfo,
                [name]: value,
            },
        });
    };

    sameAsBuyer = () => {
        const user = this.state.user;
        const address = user.address[0];
        this.setState({
            shipInfo: {
                name: user.name,
                zip: address.zip,
                addressA: address.addressA,
                addressB: address.addressB,
                email: user.email,
            },
        });
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

    componentDidMount() {
        window.addEventListener(
            'message',
            (event) => {
                if (event.data.zipCode) {
                    this.setState({
                        shipInfo: {
                            ...this.state.shipInfo,
                            zip: event.data.zipCode,
                            addressA: event.data.addressA,
                        },
                    });
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
                <PaymentInfo
                    user={user}
                    quantity={this.state.quantity}
                    info={info}
                    inputValue={this.state.creditUse}
                    inputOnChange={this.handleDiscount}
                    selectValue={this.state.payOption}
                    selectOnChange={this.handlePayOption}
                />

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
                    <Link className="text-2xl" to={`/package/${singlePackage.id}`}>
                        {singlePackage.title}
                    </Link>
                ) : (
                    <p className="text-2xl">꾸러미 구독하기</p>
                )}

                {props.isOnce ? (
                    <div className="flex flex-row">
                        <label className="text-xl mr-16">수량</label>
                        <input
                            className="w-20 pl-4 text-xl border border-green-500"
                            onChange={props.onChange}
                            value={props.headCount}
                            type="number"
                            min="1"
                            step="1"
                        ></input>
                    </div>
                ) : (
                    <div className="flex flex-row">
                        <div className="text-xl mr-16">구독 개월</div>
                        <div className="text-xl">6개월</div>
                    </div>
                )}
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

function SubscInfo(props) {
    const singlePackage = props.package;
    const { price, priceInt, date, sixMonthLater } = props.info;
    const quantity = props.isOnce ? props.quantity : 6;

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
            <div className="mb-12 text-2xl">{props.isOnce ? '구매 정보' : '구독 정보'}</div>
            {props.isOnce ? (
                <InfoItem title="수량" contents={quantity + '개'} mb={true} />
            ) : (
                <InfoItem title="구독 개월" contents="6개월" mb={true} />
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
            <lable className="col-start-1 col-end-3 text-xl">{props.title}</lable>
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

function InputItem(props) {
    return (
        <div className={`${props.mb ? 'mb-4' : 'mb-0'} grid grid-cols-12`}>
            <lable className="col-start-1 col-end-3 text-xl">{props.title}</lable>
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
    const { priceInt } = props.info;
    const quantity = props.isOnce ? props.quantity : 6;

    return (
        <div className="w-full h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 text-2xl">결제 정보</div>
            <InfoItem
                title="총합 금액"
                contents={(priceInt * quantity).toLocaleString() + '원'}
                mb={true}
            />
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
            <InfoItem
                title="결제 금액"
                contents={(priceInt * quantity - props.inputValue).toLocaleString() + '원'}
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
                    <option value="creditCard">신용카드/체크카드</option>
                    <option value="remittance">무통장 입금</option>
                </select>
            </div>

            <ButtonOne />
        </div>
    );
}

function ButtonOne(props) {
    return (
        <div className="w-25% mx-auto">
            <button className="w-full h-20 mx-auto text-2xl text-white bg-green-500">
                <Link to={'/package/onetime/' + props.id}>결제하기</Link>
            </button>
        </div>
    );
}
