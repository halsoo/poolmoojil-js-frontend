import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getUserCookie } from '../../util/api';
import {
    priceStr,
    rangeDateStr,
    oneTimeDateStr,
    timeStr,
    nextWeekDay,
    convertDayToKor,
    priceStrToInt,
} from '../../util/localeStrings';

class GatheringSubsc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            gathering: this.props.gathering,
            headCount: 1,
            creditUse: 0,
            payOption: undefined,
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

    handleHeadCount = (e) => {
        const target = e.target;
        let value = target.value;

        this.setState({
            headCount: value,
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

    handleInfo = () => {
        const gathering = this.state.gathering;

        let price = null;

        if (this.props.isAll && this.props.isOnce) price = priceStr(gathering.oncePrice);
        else price = priceStr(gathering.fullPrice);

        const priceInt = priceStrToInt(price);

        let count = null;

        if (this.props.isAll && this.props.isOnce) count = 1;
        // 1회성 참여
        else if (this.props.isAll && !this.props.isOnce) count = 12;
        // 1년 구독
        else if (!this.props.isAll && !this.props.isOnce) count = gathering.count;
        // 강좌 구독
        else if (!this.props.isAll && this.props.isOnce) count = 1; // 1회성 행사

        let date = null;

        if (this.props.isAll && this.props.isOnce) {
            const dateObj = nextWeekDay(gathering.stringDate.substring(6, 7));
            date =
                dateObj.year.toString() +
                '년 ' +
                dateObj.month.toString() +
                '월 ' +
                dateObj.date.toString() +
                '일 ' +
                convertDayToKor(dateObj.day) +
                '요일 ' +
                gathering.stringDate.substring(10, 12);
        } else if (this.props.isAll && !this.props.isOnce) {
            const dateObj = nextWeekDay(gathering.stringDate.substring(6, 7));
            date =
                dateObj.year.toString() +
                '년 ' +
                dateObj.month.toString() +
                '월 ' +
                dateObj.date.toString() +
                '일 ' +
                convertDayToKor(dateObj.day) +
                '요일을 시작으로 12회';
        } else if (!this.props.isAll && !this.props.isOnce) {
            date = rangeDateStr(gathering.rangeDate) + ' ' + gathering.stringDate;
        } else if (!this.props.isAll && this.props.isOnce) {
            date = oneTimeDateStr(gathering.oneTimeDate) + ' ' + timeStr(gathering.time);
        }

        return {
            price: price,
            priceInt: priceInt,
            count: count,
            date: date,
        };
    };

    render() {
        const gathering = this.state.gathering;
        const user = this.state.user;
        const info = gathering ? this.handleInfo() : null;
        return gathering && user ? (
            <div className="flex flex-col">
                <GatheringInfo
                    isAll={this.props.isAll}
                    isOnce={this.props.isOnce}
                    gathering={gathering}
                    info={info}
                    onChange={this.handleHeadCount}
                    headCount={this.state.headCount}
                />
                <SubscInfo gathering={gathering} headCount={this.state.headCount} info={info} />
                <UserInfo user={user} />
                <PaymentInfo
                    user={user}
                    headCount={this.state.headCount}
                    info={info}
                    inputValue={this.state.creditUse}
                    inputOnChange={this.handleDiscount}
                    selectValue={this.state.payOption}
                    selectOnChange={this.handlePayOption}
                />
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(GatheringSubsc);

function GatheringInfo(props) {
    const gathering = props.gathering;
    const { price, count, date } = props.info;

    return (
        <div className="w-full h-full p-4 grid grid-cols-12 border border-green-500">
            <div className="mr-6 col-start-1 col-end-4 border border-green-500">
                <img className="w-full" src={gathering.mainImg.link} alt="img" />
            </div>
            <div className="col-start-4 col-end-13 flex flex-col justify-around text-green-500">
                <p>{gathering.format}</p>
                <Link className="text-2xl" to={`/gathering/${gathering.id}`}>
                    {gathering.title} ({count}회 참가)
                </Link>
                <p>일시: {date}</p>
                <p>참가비: {price}</p>

                {(props.isAll && !props.isOnce) || (!props.isAll && !props.isOnce) ? null : (
                    <div className="flex flex-row">
                        <label className="text-xl mr-16">참가 인원 수</label>
                        <input
                            className="w-20 pl-4 text-xl border border-green-500"
                            onChange={props.onChange}
                            value={props.headCount}
                            type="number"
                            min="1"
                            step="1"
                        ></input>
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
    const gathering = props.gathering;
    const { priceInt, date } = props.info;
    const headCount = props.headCount;

    return (
        <div className="w-full h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 text-2xl">예약 정보</div>
            <InfoItem title="모임 정보" contents={gathering.title} mb={true} />
            <InfoItem title="일시" contents={date} mb={true} />
            <InfoItem title="장소" contents={gathering.place.name} mb={true} />
            <InfoItem title="참가 인원" contents={headCount} mb={true} />
            <InfoItem
                title="예약비"
                contents={(priceInt * headCount).toLocaleString() + '원'}
                mb={false}
            />
        </div>
    );
}

function UserInfo(props) {
    const user = props.user;

    return (
        <div className="w-full h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 text-2xl">참가자 정보</div>
            <InfoItem title="이름" contents={user.name} mb={true} />
            <InfoItem title="연락처" contents={user.phone} mb={true} />
            <InfoItem title="E-MAIL" contents={user.email} mb={false} />
        </div>
    );
}

function PaymentInfo(props) {
    const user = props.user;
    const { priceInt } = props.info;
    const headCount = props.headCount;

    return (
        <div className="w-full h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 text-2xl">결제 정보</div>
            <InfoItem
                title="총합 금액"
                contents={(priceInt * headCount).toLocaleString() + '원'}
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
                contents={(priceInt * headCount - props.inputValue).toLocaleString() + '원'}
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

            <ButtonOne />
        </div>
    );
}

function ButtonOne(props) {
    return (
        <div className="w-25% mx-auto">
            <button className="w-full h-20 mx-auto text-2xl text-white bg-green-500">
                <Link to={'/gathering/onetime/' + props.id}>결제하기</Link>
            </button>
        </div>
    );
}
