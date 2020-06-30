import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, updateMembership } from '../../util/api';

import {
    timeStampToDateSimple,
    priceStr,
    priceStrToInt,
    endDateStr,
} from '../../util/localeStrings';

import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';

export default class AdminUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined,

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
        const res = await getUsers(queryList);
        if (res.status === 200) {
            if (res.data.length !== 0) {
                if (typeof res.data === 'object') {
                    this.setState({
                        users: res.data,
                    });
                } else {
                    this.setState({
                        users: '검색 결과가 없습니다.',
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

    editMembership = async (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        const res = await updateMembership(name, value);

        if (res.status === 200) {
            this.reloadList();
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.users !== nState.users && nState.users !== undefined) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.users ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="w-full p-4 h-auto border border-green-500">
                    <div className="w-full p-4 h-auto bg-green-500 text-white border border-green-500">
                        <div className="mb-4 text-2xl font-bold">회원 검색</div>
                        <TextInput
                            title="이름으로 검색"
                            name="search"
                            onChange={this.handleInput}
                            value={this.state.query.name}
                            onClick={this.reloadList}
                        />
                    </div>
                    <table className="w-full p-4">
                        <tbody>
                            <tr className="w-full h-16 flex flex-row justify-between text-green-500 border-b border-green-500">
                                <th className="text-xl self-center font-normal">회원명</th>
                                <th className="text-xl self-center font-normal">아이디</th>
                                <th className="text-xl self-center font-normal">전화번호</th>
                                <th className="text-xl self-center font-normal">E-Mail</th>
                                <th className="text-xl self-center font-normal">가입일</th>
                                <th className="text-xl self-center font-normal">회원 등급</th>
                            </tr>
                            {typeof this.state.users === 'object' ? (
                                this.state.users.map((d, i) => (
                                    <tr
                                        className="mb-4 flex flex-row justify-between text-green-500 border-b border-green-500"
                                        key={i}
                                    >
                                        <th className="my-auto text-base font-normal">
                                            <Link to={'/users/' + d.id}>{d.name}</Link>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <Link to={'/users/' + d.id}>{d.userID}</Link>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <Link to={'/users/' + d.id}>{d.phone}</Link>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <Link to={'/users/' + d.id}>{d.email}</Link>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {timeStampToDateSimple(d.createdAt)}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <MembershipSelector
                                                name={d.id}
                                                value={d.membership}
                                                onChange={this.editMembership}
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

function MembershipSelector(props) {
    return (
        <select className="" name={props.name} value={props.value} onChange={props.onChange}>
            <option value="">선택 안함</option>
            <option value="일반 회원">일반 회원</option>
            <option value="후원 회원">후원 회원</option>
        </select>
    );
}
