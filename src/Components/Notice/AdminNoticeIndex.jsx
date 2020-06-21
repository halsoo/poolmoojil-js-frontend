import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getNotices, deleteNotice } from '../../util/api';

import { timeStampToDateSimple } from '../../util/localeStrings';

import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';

export default class AdminNoticeIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notices: undefined,

            query: {
                page: 1,
                offset: 5,
            },
        };
        this.reloadList();
    }

    reloadList = async () => {
        const query = this.state.query;
        const queryList = {
            page: query.page,
            offset: query.offset,
        };
        const res = await getNotices(queryList);
        if (res.status === 200) {
            if (res.data.length !== 0) {
                this.setState({
                    notices: res.data,
                });
            } else {
                this.setState({
                    notices: '검색 결과가 없습니다.',
                    query: {
                        ...this.state.query,
                        page: this.state.query.page > 1 ? this.state.query.page - 1 : 1,
                    },
                });
            }
        }
    };

    delete = async (id) => {
        const res = await deleteNotice(id);

        if (res.status === 204) {
            this.reloadList();
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.notices !== nState.notices && nState.notices !== undefined) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.notices ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="w-full h-auto mb-4 p-4 flex flex-row justify-between text-green-500">
                    <div className="w-50% h-full text-3xl">공지 관리하기</div>
                    <div className="w-20% flex flex-row justify-between text-2xl">
                        <Link to="/notice/add">+ 공지 추가</Link>
                    </div>
                </div>

                <div className="w-full p-4 h-auto">
                    <table className="w-full p-4">
                        <tbody>
                            {typeof this.state.notices === 'object' ? (
                                this.state.notices.map((d, i) => (
                                    <tr
                                        className="mb-4 flex flex-row justify-between text-green-500 border-b border-green-500"
                                        key={i}
                                    >
                                        <th className="w-20% text-left flex flex-row font-normal">
                                            <div className="text-3xl self-center">{d.title}</div>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            {timeStampToDateSimple(d.createdAt)}
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <Link to={'/notice/edit/' + d.id}>수정</Link>
                                        </th>
                                        <th className="my-auto text-base font-normal">
                                            <button onClick={() => this.delete(d.id)}>삭제</button>
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

                        <div className="text-xl text-green-500">{this.state.query.page}</div>

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
