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

import ButtonOne from '../shared/ButtonOne';

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
                gathering.stringDate.substring(10, 12) +
                '시';
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

                <div className="mt-2 p-4 flex flex-col text-green-500 border border-green-500">
                    <div className="lg:text-2xl sm:text-5xl mb-10">배송/교환/반품 안내</div>
                    <p className="lg:text-xl sm:text-5xl">
                        읽기모임: 당일 취소환불 불가, 전일까지는 100% 환불
                    </p>
                    <p className="mt-2 lg:text-xl sm:text-5xl">
                        강연/세미나: 개강일로부터 4일 전까지 100% 환불, 개강일 전 3일까지 50% 환불,
                        개강일 이후 환불이 불가
                    </p>
                </div>

                <SubscInfo gathering={gathering} headCount={this.state.headCount} info={info} />
                <UserInfo user={user} />

                <div className="w-full h-full mt-2 p-4 flex flex-col border border-green-500">
                    <PaymentInfo
                        user={user}
                        headCount={this.state.headCount}
                        info={info}
                        inputValue={this.state.creditUse}
                        inputOnChange={this.handleDiscount}
                        selectValue={this.state.payOption}
                        selectOnChange={this.handlePayOption}
                    />
                    <ButtonOne
                        history={this.props.history}
                        pg={this.state.payOption}
                        gathering={gathering}
                        origin="gathering_onetime"
                        price={this.state.headCount * info.priceInt}
                        headCount={this.state.headCount}
                        user={this.state.user}
                        creditUse={this.state.creditUse}
                    />
                </div>
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
                <p className="sm:text-5xl">{gathering.format}</p>
                <Link className="lg:text-2xl sm:text-5xl" to={`/gathering/${gathering.id}`}>
                    {gathering.title} ({count}회 참가)
                </Link>
                <p className="sm:text-5xl">일시: {date}</p>
                <p className="sm:text-5xl">참가비: {price}</p>

                {(props.isAll && !props.isOnce) || (!props.isAll && !props.isOnce) ? null : (
                    <div className="flex flex-row">
                        <label className="lg:text-xl sm:text-5xl mr-16">참가 인원 수</label>
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
            <div className="col-start-1 col-end-3 lg:text-xl sm:text-5xl">{props.title}</div>
            <div className="col-start-3 col-end-13 lg:text-xl sm:text-5xl">{props.contents}</div>
        </div>
    );
}

function SubscInfo(props) {
    const gathering = props.gathering;
    const { priceInt, date } = props.info;
    const headCount = props.headCount;

    return (
        <div className="w-full h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 lg:text-2xl sm:text-5xl">예약 정보</div>
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
        <div className="text-green-500">
            <div className="mb-12 text-2xl">결제 정보</div>
            <InfoItem
                title="총합 금액"
                contents={(priceInt * headCount).toLocaleString() + '원'}
                mb={true}
            />
            <div className="mb-4 grid grid-cols-12">
                <div className="col-start-1 col-end-3 lg:text-xl sm:text-5xl">적립금 사용</div>
                <div className="col-start-3 col-end-13 flex flex-row lg:text-xl sm:text-5xl">
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
                <div className="col-start-1 col-end-3 lg:text-xl sm:text-5xl">결제 방법</div>
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
