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

        this.setState({
            creditUse: value,
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
        const info = this.handleInfo();
        return gathering ? (
            <div className="flex flex-col">
                <GatheringInfo
                    isAll={this.props.isAll}
                    isOnce={this.props.isOnce}
                    gathering={gathering}
                    info={info}
                    onChange={this.handleHeadCount}
                    headCount={this.state.headCount}
                />
                <SubscInfo gathering={gathering} info={info} />
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

function SubscInfo(props) {
    const gathering = props.gathering;
    const { price, priceInt, count, date } = props.info;

    return (
        <div className="w-full h-full mt-2 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="mb-12 text-2xl">예약 정보</div>
            <InfoItem title="모임 정보" contents={gathering.title} />
        </div>
    );
}

function InfoItem(props) {
    return (
        <div className="flex flex-row">
            <div className="mr-16 text-xl">{props.title}</div>
            <div className="text-xl">{props.contents}</div>
        </div>
    );
}
