import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getGatheringPeople, getGatheringByID, updateShowUp } from '../../util/api';

import {
    timeStampToDateSimple,
    rangeDateStr,
    oneTimeDateStr,
    timeStr,
    priceStr,
} from '../../util/localeStrings';

import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';

export default class AdminGatheringPeople extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gathering: undefined,
            gatheringHistories: undefined,

            query: {
                id: this.props.match.params.id,
                page: 1,
                offset: 5,
                name: '',
                orderNum: '',
            },
        };
        this.loadGathering();
        this.reloadList();
    }

    loadGathering = async () => {
        const res = await getGatheringByID(this.props.match.params.id);

        if (res.status === 200) {
            this.setState({
                gathering: res.data,
            });
        }
    };

    reloadList = async () => {
        const query = this.state.query;
        const queryList = {
            id: query.id,
            page: query.page,
            offset: query.offset,
            name: query.name,
        };
        const res = await getGatheringPeople(queryList);
        if (res.status === 200) {
            if (res.data.length !== 0) {
                if (typeof res.data === 'object') {
                    this.setState({
                        gatheringHistories: res.data,
                    });
                } else {
                    this.setState({
                        gatheringHistories: '검색 결과가 없습니다.',
                    });
                }
            } else {
                this.setState({
                    query: {
                        ...this.state.query,
                        page: this.state.query.page > 1 ? this.state.query.page - 1 : 1,
                    },
                });
            }
        }
    };

    handleInput = (event) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            query: {
                ...this.state.query,
                name: value,
            },
        });
    };

    editShowUp = async (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        const res = await updateShowUp(name, value);

        if (res.status === 200) {
            this.reloadList();
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (
            (this.state.gatheringHistories !== nState.gatheringHistories &&
                nState.gatheringHistories !== undefined) ||
            this.state.gathering !== nState.gathering
        ) {
            return true;
        }

        return true;
    }

    render() {
        const gathering = this.state.gathering;
        const fullDate = gathering
            ? gathering.rangeDate
                ? rangeDateStr(gathering.rangeDate)
                : ''
            : '';
        const oneDate = gathering
            ? gathering.oneTimeDate
                ? oneTimeDateStr(gathering.oneTimeDate)
                : ''
            : '';
        const time = gathering ? (gathering.time ? timeStr(gathering.time) : null) : '';
        const oncePrice = gathering
            ? gathering.oncePrice
                ? priceStr(gathering.oncePrice)
                : null
            : null;
        const fullPrice = gathering
            ? gathering.fullPrice
                ? priceStr(gathering.fullPrice)
                : null
            : null;

        return this.state.gathering ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">모임 관리하기</p>
                </div>

                <div className="w-full p-4 h-auto border border-green-500">
                    <div className="w-full mb-8 flex flex-row">
                        <div className="w-30%">
                            {gathering.mainImg ? (
                                <img
                                    className="w-full h-auto my-auto border border-green-500"
                                    src={gathering.mainImg.link}
                                    alt=""
                                />
                            ) : (
                                <div className="w-full h-auto my-auto border border-green-500 bg-purple-500" />
                            )}
                        </div>
                        <div className="w-full ml-4 flex flex-col text-green-500">
                            <div className="mb-2 text-xl">{gathering.format}</div>
                            <div className="mb-2 text-3xl">{gathering.title}</div>
                            <div className="mb-2 text-xl">
                                일시:{' '}
                                {gathering.count === 1
                                    ? oneDate + ' ' + time
                                    : fullDate + ' ' + gathering.stringDate}
                            </div>
                            <div className="mb-2 text-xl">장소: {gathering.place.name}</div>
                            <div className="mb-2 text-xl">
                                회차 수: {gathering.isAll ? '상시' : gathering.count + '회'}
                            </div>
                            <div className="text-xl">
                                참가비:{' '}
                                {oncePrice
                                    ? '1회 ' + oncePrice + '원 / 12회 ' + fullPrice + '원'
                                    : fullPrice + '원'}
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 text-2xl text-green-500 font-bold">모임 참가 인원</div>
                    <TextInput
                        title="이름으로 검색"
                        name="search"
                        onChange={this.handleInput}
                        value={this.state.query.name}
                        onClick={this.reloadList}
                    />
                    <table className="w-full p-4">
                        <tbody>
                            <tr className="w-full h-16 flex flex-row justify-between text-green-500 border-b border-green-500">
                                <th className="text-xl self-center font-normal">참가자명</th>
                                <th className="text-xl self-center font-normal">모임일</th>
                                <th className="text-xl self-center font-normal">장소</th>
                                <th className="text-xl self-center font-normal">참가 인원</th>
                                <th className="text-xl self-center font-normal">예약 번호</th>
                                <th className="text-xl self-center font-normal">예약일</th>
                                <th className="text-xl self-center font-normal">참가 여부</th>
                            </tr>
                            {typeof this.state.gatheringHistories === 'object' ? (
                                this.state.gatheringHistories.map((d, i) => (
                                    <tr
                                        className="mb-4 flex flex-row justify-between text-green-500 border-b border-green-500"
                                        key={i}
                                    >
                                        <th className="my-auto text-base font-normal">
                                            {d.user.name}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {timeStampToDateSimple(d.date)}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {d.gathering.place.name}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {d.headCount}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {'...' + d.orderNum.substring(13)}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {timeStampToDateSimple(d.createdAt)}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <ShowUpSelector
                                                name={d.id}
                                                value={d.showUp}
                                                onChange={this.editShowUp}
                                            />
                                        </th>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-xl text-green-500">
                                    <th>"검색 결과가 없습니다."</th>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-8 mx-auto w-40% flex flex-row justify-around">
                        <button
                            onClick={() => {
                                this.setState(
                                    {
                                        query: {
                                            ...this.state.query,
                                            page:
                                                this.state.query.page > 1
                                                    ? this.state.query.page - 1
                                                    : this.state.query.page,
                                        },
                                    },
                                    this.reloadList,
                                );
                            }}
                        >
                            <img className="mx-auto w-2/12 h-auto" src={left} alt="left" />
                        </button>

                        <div className="text-xl">{this.state.query.page}</div>

                        <button
                            onClick={() => {
                                this.setState(
                                    {
                                        query: {
                                            ...this.state.query,
                                            page: this.state.query.page + 1,
                                        },
                                    },
                                    this.reloadList,
                                );
                            }}
                        >
                            <img className="mx-auto w-2/12 h-auto" src={right} alt="left" />
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-xl text-green-500">loading</div>
        );
    }
}

function TextInput(props) {
    return (
        <div className="mb-4 grid grid-cols-12 ">
            <div className="col-start-1 col-end-3 text-base text-green-500 "> {props.title} </div>
            <div className="col-start-4 col-end-10 flex flex-row justify-between">
                <input
                    className="pl-2 w-85% text-black text-base border border-green-500"
                    name={props.name}
                    type="text"
                    value={props.value}
                    onChange={props.onChange}
                />
                <button
                    className="w-10% bg-white text-green-500 border border-green-500"
                    type="button"
                    onClick={props.onClick}
                >
                    검색
                </button>
            </div>
        </div>
    );
}

function ShowUpSelector(props) {
    return (
        <select className="" name={props.name} value={props.value} onChange={props.onChange}>
            <option value="">선택 안함</option>
            <option value="불참">불참</option>
            <option value="참가">참가</option>
            <option value="예약 취소 대기중">예약 취소 대기중</option>
            <option value="예약 취소">예약 취소</option>
        </select>
    );
}
