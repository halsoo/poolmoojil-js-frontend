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

    shouldComponentUpdate(nProps, nState) {
        if (
            this.state.postList !== nState.postList ||
            this.state.currentPost !== nState.currentPost
        ) {
            return true;
        }

        return true;
    }

    render() {
        const body = this.state.currentPost
            ? this.state.currentPost.desc.split(/\r\n|\r|\n/)
            : null;
        return (
            <div className="h-full p-6 flex flex-col justify-between text-green-500 border border-green-500">
                <div className="w-full font-bold lg:text-3xl sm:text-6xl">공지사항</div>
                {this.state.currentPost ? (
                    <div>
                        <div className="flex flex-row justify-between">
                            <div className="lg:text-3xl sm:text-6xl">
                                {this.state.currentPost.title}
                            </div>
                            <div className="my-auto lg:text-lg sm:text-4xl">
                                {timeStampToDate(this.state.currentPost.createdAt)}
                            </div>
                        </div>

                        <div className="mt-8 mb-4 lg:text-lg sm:text-4xl">
                            {body.map((para, index) => {
                                return <p key={index}>{para}</p>;
                            })}
                        </div>
                    </div>
                ) : null}

                <table className="w-full mt-8">
                    <tbody>
                        {typeof this.state.postList === 'object' ? (
                            this.state.postList.map((d, i) => (
                                <tr
                                    className="mb-4 flex flex-row justify-between text-green-500 border-b border-green-500"
                                    key={i}
                                >
                                    {this.state.currentPost ? (
                                        this.state.currentPost.id !== d.id ? (
                                            <th className="text-left font-normal">
                                                <button onClick={(e) => this.getCurrentPost(d.id)}>
                                                    <div className="lg:text-3xl sm:text-6xl">
                                                        {d.title}
                                                    </div>
                                                </button>
                                            </th>
                                        ) : (
                                            <th className="text-left font-bold">
                                                <div className="lg:text-3xl sm:text-6xl">
                                                    {d.title}
                                                </div>
                                            </th>
                                        )
                                    ) : (
                                        <th className="text-left font-normal">
                                            <button onClick={(e) => this.getCurrentPost(d.id)}>
                                                <div className="lg:text-3xl sm:text-6xl">
                                                    {d.title}
                                                </div>
                                            </button>
                                        </th>
                                    )}
                                    <th className="my-auto lg:text-lg sm:text-4xl font-normal">
                                        {timeStampToDate(d.createdAt)}
                                    </th>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-xl text-green-500">
                                <th>"공지가 없습니다."</th>
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

                    <div className="lg:text-xl sm:text-4xl">{this.state.query.page}</div>

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
        );
    }
}

export default Notice;
