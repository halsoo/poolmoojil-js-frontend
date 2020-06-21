import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getGatheringHistories } from '../../util/api';

import { timeStampToDateSimple } from '../../util/localeStrings';

import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';

export default class AdminGatheringHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gatheringHistories: undefined,

            query: {
                page: 1,
                offset: 5,
                name: undefined,
                orderNum: undefined,
            },
        };
        this.reloadList();
    }

    reloadList = async () => {
        const query = this.state.query;
        const queryList = {
            page: query.page,
            offset: query.offset,
            name: query.name,
        };
        const res = await getGatheringHistories(queryList);
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

    shouldComponentUpdate(nProps, nState) {
        if (
            this.state.gatheringHistories !== nState.gatheringHistories &&
            nState.gatheringHistories !== undefined
        ) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.gatheringHistories ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">모임 관리하기</p>
                </div>

                <div className="w-full p-4 h-auto border border-green-500">
                    <div className="mb-4 text-2xl text-green-500 font-bold">모임 예약 내역</div>
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
                                <th className="w-20% self-center text-xl text-left font-normal">
                                    모임 이름
                                </th>
                                <th className="text-xl self-center font-normal">참가자명</th>
                                <th className="text-xl self-center font-normal">모임일</th>
                                <th className="text-xl self-center font-normal">장소</th>
                                <th className="text-xl self-center font-normal">참가 인원</th>
                                <th className="text-xl self-center font-normal">예약 번호</th>
                                <th className="text-xl self-center font-normal">예약일</th>
                            </tr>
                            {typeof this.state.gatheringHistories === 'object' ? (
                                this.state.gatheringHistories.map((d, i) => (
                                    <tr
                                        className="mb-4 flex flex-row justify-between text-green-500 border-b border-green-500"
                                        key={i}
                                    >
                                        <th className="w-20% text-left flex flex-row font-normal">
                                            <img
                                                className="w-30% mr-4"
                                                src={d.gathering.mainImg.link}
                                                alt=""
                                            />
                                            <div className="text-base self-center">
                                                {d.gathering.title}
                                            </div>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <Link to={'/gathering/history/' + d.orderNum}>
                                                {d.user.name}
                                            </Link>
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
                                            <Link to={'/gathering/history/' + d.orderNum}>
                                                {'...' + d.orderNum.substring(13)}
                                            </Link>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {timeStampToDateSimple(d.createdAt)}
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
