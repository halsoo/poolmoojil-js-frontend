import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getGoods } from '../../util/api';
import { priceStr } from '../../util/localeStrings';

import triangle from '../../img/triangle.png';

class Good extends Component {
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

    render() {
        console.log(this.state.goods);
        return (
            <div className="flex flex-col justify-between">
                <div className="mb-4 p-4 flex flex-col bg-green-500 text-white">
                    <div className="mb-2 font-bold text-2xl">풀무질 굿즈</div>
                </div>

                {this.state.goods ? (
                    <div className="flex flex-col justify-center">
                        <GoodList goods={this.state.goods} />

                        <button
                            className="relative mx-auto mt-16 w-10% h-12 text-white"
                            onClick={this.handleMore}
                        >
                            <img className="w-full" src={triangle} alt="" />
                            <div className="absolute top-0 left-2vw">더보기</div>
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}

const MapStateToProps = (state) => ({});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(Good);

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
            <div className="h-full flex flex-col justify-center">
                <img src={good.mainImg.link} alt="" />
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
