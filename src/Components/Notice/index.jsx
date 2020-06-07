import React, { Component } from 'react';

import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';

import { getNotices, getNoticeByID } from '../../util/api';
import { timeStampToDate } from '../../util/localeStrings';

class Notice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: {
                page: 1,
                offset: 6,
            },
            postList: undefined,
            currentPost: undefined,
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
                    postList: res.data,
                });
            } else {
                this.setState({
                    query: {
                        ...this.state.query,
                        page: this.state.query.page - 1,
                    },
                });
            }
        }
    };

    getCurrentPost = async (id) => {
        const res = await getNoticeByID(id);

        if (res.status === 200) {
            this.setState({
                currentPost: res.data,
                query: {
                    ...this.state.query,
                    id: res.data.id,
                },
            });
        }
    };

    render() {
        const body = this.state.currentPost
            ? this.state.currentPost.desc.split(/\r\n|\r|\n/)
            : null;
        return this.state.postList ? (
            <div className="h-full p-6 flex flex-col justify-between text-green-500 border border-green-500">
                {this.state.currentPost ? (
                    <div>
                        <div className="flex flex-row justify-between">
                            <div className="text-3xl">{this.state.currentPost.title}</div>
                            <div className="my-auto text-lg">
                                {timeStampToDate(this.state.currentPost.createdAt)}
                            </div>
                        </div>

                        <div className="mt-8 mb-4 text-lg">
                            {body.map((para, index) => {
                                return <p key={index}>{para}</p>;
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="w-full font-bold text-3xl">공지사항</div>
                )}

                <table className="mt-8">
                    <tbody>
                        {this.state.postList.map((d, i) => (
                            <tr
                                className="mb-4 flex flex-row justify-between text-green-500 border-b border-green-500"
                                key={i}
                            >
                                {this.state.currentPost ? (
                                    this.state.currentPost.id !== d.id ? (
                                        <th className="text-left font-normal">
                                            <button onClick={(e) => this.getCurrentPost(d.id)}>
                                                <div className="text-3xl">{d.title}</div>
                                            </button>
                                        </th>
                                    ) : (
                                        <th className="text-left font-bold">
                                            <div className="text-3xl">{d.title}</div>
                                        </th>
                                    )
                                ) : (
                                    <th className="text-left font-normal">
                                        <button onClick={(e) => this.getCurrentPost(d.id)}>
                                            <div className="text-3xl">{d.title}</div>
                                        </button>
                                    </th>
                                )}
                                <th className="my-auto text-lg font-normal">
                                    {timeStampToDate(d.createdAt)}
                                </th>
                            </tr>
                        ))}
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
        ) : null;
    }
}

export default Notice;
