import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getGatheringHistoriesByUser, getUserCookie } from '../../util/api';

import { timeStampToDateSimple } from '../../util/localeStrings';

import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';

class MyPageGatheringHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gatheringHistories: undefined,

            query: {
                page: 1,
                offset: 5,
                user: undefined,
            },
        };
        this.getUser();
    }

    getUser = async () => {
        const res = await getUserCookie();
        if (res.status === 200) {
            this.setState(
                {
                    query: {
                        ...this.state.query,
                        user: res.data,
                    },
                },
                this.reloadList,
            );
        }
    };

    reloadList = async () => {
        const query = this.state.query;
        const queryList = {
            page: query.page,
            offset: query.offset,
            user: query.user,
        };
        const res = await getGatheringHistoriesByUser(queryList);

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
            <div className="w-full h-auto p-4 flex flex-col border border-green-500">
                <div className="mb-8 w-full h-auto flex flex-col justify-between text-green-500">
                    <p className="mb-4 text-3xl">모임 예약 내역</p>
                    <p className="text-xl">예약 번호를 클릭해서 세부 내역 보기</p>
                </div>

                <div className="w-full h-auto">
                    <table className="w-full">
                        <tbody>
                            <tr className="w-full h-16 flex flex-row justify-between text-green-500 border-b border-green-500">
                                <th className="w-15% self-center text-xl text-left font-normal">
                                    모임 이름
                                </th>
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
                                            {timeStampToDateSimple(d.date)}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {d.gathering.place.name}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {d.headCount}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <Link to={'/mypage/gathering-history/' + d.orderNum}>
                                                {d.orderNum}
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

const MapStateToProps = (state) => ({
    logged: state.logged,
    cookie: state.cookie,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(MyPageGatheringHistory);

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
