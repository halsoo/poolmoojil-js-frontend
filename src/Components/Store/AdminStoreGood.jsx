import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getGoods, deleteGood } from '../../util/api';
import { priceStr } from '../../util/localeStrings';

import triangle from '../../img/triangle.png';

export default class AdminStoreGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: [],
            query: {
                page: 1,
                offset: 16,
            },
        };

        this.refreshList();
    }

    refreshList = async () => {
        const queryList = {
            page: 1,
            offset: this.state.query.offset,
        };

        const res = await getGoods(queryList);

        if (res.status === 200) {
            let goods = [];
            goods.push(res.data);
            this.setState({
                goods: goods,
                query: {
                    ...this.state.query,
                    page: 1,
                },
            });
        }
    };

    pushList = async () => {
        const query = this.state.query;

        const queryList = {
            page: query.page,
            offset: query.offset,
        };

        const res = await getGoods(queryList);

        if (res.status === 200) {
            if (res.data.length !== 0) {
                let goods = this.state.goods;
                goods.push(res.data);
                this.setState({
                    goods: goods,
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

    handleMore = () => {
        this.setState(
            {
                query: {
                    ...this.state.query,
                    page: this.state.query.page + 1,
                },
            },
            this.pushList,
        );
    };

    delete = async (id) => {
        const res = await deleteGood(id);

        if (res.status === 204) {
            this.refreshList();
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.goods !== nState.goods) {
            return true;
        }

        return true;
    }

    render() {
        return (
            <div className="flex flex-col justify-between">
                <div className="w-full h-auto mb-4 p-4 flex flex-row justify-between text-green-500">
                    <div className="w-50% h-full text-3xl">굿즈 관리하기</div>
                    <div className="flex flex-row justify-between text-2xl">
                        <Link to="/store/good/add">+ 굿즈 추가</Link>
                    </div>
                </div>

                {this.state.goods ? (
                    <div className="flex flex-col justify-center">
                        <GoodList goods={this.state.goods} />

                        <button
                            className="relative mx-auto mt-16 w-10% h-12 text-white"
                            onClick={this.handleMore}
                        >
                            <img className="w-full" src={triangle} alt="" />
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}

function GoodList(props) {
    return (
        <div className="flex flex-col">
            {props.goods.map((goodRow, index) => {
                const multirow = props.goods.length > 1 ? true : false;
                return (
                    <div
                        className={`mb-8 flex flex-row ${
                            multirow ? 'justify-start' : 'justify-center'
                        }`}
                    >
                        {goodRow.map((g, index) => {
                            const end = (index + 1) % 4 === 0 ? true : false;
                            return <GoodItem key={index} good={g} end={end} />;
                        })}
                    </div>
                );
            })}
        </div>
    );
}

function GoodItem(props) {
    const good = props.good;
    const price = priceStr(good.price);

    return (
        <div
            className={`w-24% ${
                props.end ? 'mr-0' : 'mr-4'
            } flex flex-col items-stretch justify-between`}
        >
            <div className="h-full h-auto relative">
                <img className="my-auto" src={good.mainImg.link} alt="" />
                <div className="absolute w-32 h-auto top-4 right-4 flex flex-col">
                    <Link
                        to={'/store/good/edit/' + good.id}
                        className="mb-4 p-4 text-center text-xl text-white bg-green-500"
                    >
                        수정
                    </Link>
                    <button
                        className="p-4 text-xl text-white bg-green-500"
                        onClick={() => props.delete(good.id)}
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="flex flex-col justify-between text-lg text-green-500">
                <Link className="mx-auto" to={'/store/good/' + good.id}>
                    <p className="font-bold">{good.name}</p>
                </Link>
                <p className="mx-auto">{price}원</p>
            </div>
        </div>
    );
}
