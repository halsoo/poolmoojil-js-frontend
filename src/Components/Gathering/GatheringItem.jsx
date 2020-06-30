import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getGatheringByID } from '../../util/api';
import { priceStr, rangeDateStr, oneTimeDateStr, timeStr } from '../../util/localeStrings';

class GatheringItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gathering: undefined,
        };

        this.getInfo();
    }

    getInfo = async () => {
        const res = await getGatheringByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState({
                gathering: res.data,
            });
        }
    };

    render() {
        const gathering = this.state.gathering;
        return gathering ? (
            <div className="flex flex-col">
                <div className="flex lg:flex-row sm:flex-col justify-between border border-green-500">
                    <div className="lg:w-50% sm:w-full h-auto sm:order-2">
                        <GatheringItemDesc gathering={gathering} />
                    </div>
                    <div className="lg:w-50% sm:w-full h-auto p-4 flex flex-col sm:order-1">
                        <div className="lg:w-90% sm:w-full mx-auto">
                            {gathering.mainImg ? (
                                <img
                                    className="w-full border border-green-500"
                                    src={gathering.mainImg.link}
                                    alt=""
                                />
                            ) : (
                                <div className="w-full bg-purple-500 border border-green-500" />
                            )}

                            {!this.props.logged.status ? (
                                <ButtonLogin />
                            ) : gathering.isOver ? (
                                <ButtonOver />
                            ) : gathering.isAll ? (
                                <ButtonGroup id={gathering.id} />
                            ) : (
                                <ButtonOne id={gathering.id} />
                            )}
                        </div>
                    </div>
                </div>
                {gathering.books.length !== 0 ? (
                    <div className="mt-2 p-4 flex flex-col text-green-500 border border-green-500">
                        <p className="m-4 lg:text-2xl sm:text-5xl mb-4">읽기모임 텍스트</p>
                        {gathering.books.map((book, index) => {
                            let last = false;
                            if (index === gathering.books.length - 1) last = true;
                            return (
                                <ReadingText key={index} book={book} index={index} last={last} />
                            );
                        })}
                    </div>
                ) : null}
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(GatheringItem);

function GatheringItemDesc(props) {
    const gathering = props.gathering;

    const body = gathering.desc.split(/\r\n|\r|\n/);

    const oncePrice = null;
    const fullPrice = gathering.fullPrice ? priceStr(gathering.fullPrice) : null;
    const fullDate = gathering.rangeDate ? rangeDateStr(gathering.rangeDate) : '';
    const oneDate = gathering.oneTimeDate ? oneTimeDateStr(gathering.oneTimeDate) : '';
    const time = gathering.time ? timeStr(gathering.time) : null;

    return (
        <div className="w-full h-full p-4 flex flex-col text-green-500">
            <p className="lg:text-2xl sm:text-6xl mb-4">{gathering.format}</p>
            <p className="lg:text-3xl sm:text-6xl mb-4">{gathering.title}</p>
            <p className="lg:text-xl sm:text-5xl mb-4">
                일시:{' '}
                {gathering.count === 1
                    ? oneDate + ' ' + time
                    : fullDate + ' ' + gathering.stringDate}
            </p>
            <p className="lg:text-xl sm:text-5xl mb-4">
                장소: {gathering.place.name} ({gathering.place.address})
            </p>
            <p className="lg:text-xl sm:text-5xl mb-4">
                회차 수: {gathering.isAll ? '상시' : gathering.count + '회'}
            </p>
            <p className="lg:text-xl sm:text-5xl mb-10">
                참가비:{' '}
                {oncePrice
                    ? '1회 ' + oncePrice + '원 / 12회 ' + fullPrice + '원'
                    : fullPrice + '원'}
            </p>

            <div>
                {body.map((para, index) => {
                    return (
                        <p className="mb-6 lg:text-base sm:text-5xl" key={index}>
                            {para}
                        </p>
                    );
                })}
            </div>
        </div>
    );
}

function ButtonGroup(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button className="w-full lg:h-18 sm:h-32 lg:text-2xl sm:text-5xl text-white bg-green-500 border border-green-500">
                <Link to={'/gathering/onetime/' + props.id}>1회 참가 신청</Link>
            </button>
        </div>
    );
}

function ButtonOne(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button className="w-full lg:h-18 sm:h-32 lg:text-2xl sm:text-5xl text-white bg-green-500">
                <Link to={'/gathering/onetime/' + props.id}>참여하기</Link>
            </button>
        </div>
    );
}

function ButtonOver(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button
                className="w-full lg:h-18 sm:h-32 lg:text-2xl sm:text-5xl text-green-500 border border-green-500"
                name="Over"
            >
                지난 모임입니다
            </button>
        </div>
    );
}

function ButtonLogin(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button
                className="w-full lg:h-18 sm:h-32 text-white lg:text-2xl sm:text-5xl bg-green-500"
                name="needLogin"
            >
                <Link to="/login">참여하려면 로그인</Link>
            </button>
        </div>
    );
}

function ReadingText(props) {
    const book = props.book;

    return (
        <div className="flex flex-col">
            <div className="w-full p-4 flex flex-row justify-between">
                <img className="flex-grow-0" src={book.mainImg.link} alt="" />
                <div className="w-50% my-auto px-10 flex-grow ">
                    <p className="mb-4 lg:text-lg sm:text-5xl">{props.index + 1}번째 텍스트</p>
                    <p className="mb-4 lg:text-2xl sm:text-5xl">{book.title}</p>
                    <p className="mb-4 lg:text-lg sm:text-5xl"> 저자: {book.author}</p>
                    <p className="mb-4 lg:text-lg sm:text-5xl">출판사: {book.publishingCompany}</p>
                </div>

                <button className="w-20% h-18 my-auto lg:text-2xl sm:text-5xl text-white bg-green-500">
                    <Link to={'/store/book/' + book.id}>장터에서 보기</Link>
                </button>
            </div>
            {!props.last ? <div className="border-b border-green-500" /> : null}
        </div>
    );
}
