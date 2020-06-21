import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ko';
import './calendar.css';

import { getGatherings, changeIsOver, deleteGathering } from '../../util/api';
import { priceStr, rangeDateStr, oneTimeDateStr, timeStr } from '../../util/localeStrings';

import gatheringImg from '../../img/gathering_img.png';
import triangle from '../../img/triangle.png';

let localizer = momentLocalizer(moment);

class Gathering extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gatherings: [],
            query: {
                category: undefined,
                isOver: undefined,
                title: undefined,
                page: 1,
                offset: 5,
            },

            filterA: {
                event: false,
                lecture: false,
                reading: false,
            },
            filterB: {
                upcoming: false,
                past: false,
            },
            filterD: '',
        };

        this.refreshList();
    }

    refreshList = async () => {
        const query = this.state.query;
        const queryList = {
            category: query.category,
            isOver: query.isOver,
            place: query.place,
            title: query.title,
            page: 1,
            offset: query.offset,
        };
        const res = await getGatherings(queryList);
        if (res.status === 200) {
            this.setState({
                gatherings: res.data,
            });
        }
    };

    pushList = async () => {
        const query = this.state.query;
        const queryList = {
            category: query.category,
            isOver: query.isOver,
            title: query.title,
            page: query.page,
            offset: query.offset,
        };
        const res = await getGatherings(queryList);
        if (res.status === 200) {
            if (res.data.length !== 0) {
                let gatherings = this.state.gatherings;
                gatherings.push(...res.data);
                this.setState({
                    gatherings: gatherings,
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

    handleFilter = (name, pName, state) => {
        const sum = Object.values(state).reduce((a, b) => a + b, 0);

        let checked = {};

        if (sum === 0) {
            checked = {
                ...state,
                [name]: !pName,
            };
        } else if (sum === 1) {
            const pChecked = state;
            const trueKeys = Object.keys(pChecked).filter((key) => key !== name);
            let inverted = {};
            for (const key of trueKeys) {
                inverted[key] = false;
            }
            checked = {
                ...inverted,
                [name]: !pName,
            };
        }

        return checked;
    };

    handleFilterA = (e) => {
        const target = e.target;
        const name = target.name;
        const pName = this.state.filterA[name];

        let category = undefined;

        switch (name) {
            case 'event':
                category = '행사';
                break;
            case 'lecture':
                category = '강좌';
                break;
            case 'reading':
                category = '읽기모임';
                break;
        }

        if (pName === true) category = undefined;

        const checked = this.handleFilter(name, pName, this.state.filterA);

        this.setState({
            query: {
                ...this.state.query,
                category: category,
            },
            filterA: checked,
        });
    };
    handleFilterB = (e) => {
        const target = e.target;
        const name = target.name;
        const pName = this.state.filterB[name];

        let isOver = undefined;

        switch (name) {
            case 'upcoming':
                isOver = false;
                break;
            case 'past':
                isOver = true;
                break;
        }

        if (pName === true) isOver = undefined;

        const checked = this.handleFilter(name, pName, this.state.filterB);

        this.setState({
            query: {
                ...this.state.query,
                isOver: isOver,
            },
            filterB: checked,
        });
    };
    handleFilterD = (e) => {
        const target = e.target;
        const value = target.value;
        const title = '%' + value + '%';

        this.setState({
            query: {
                ...this.state.query,
                title: title,
            },
            filterD: value,
        });
    };

    handleSearch = () => {
        this.setState(
            {
                query: {
                    ...this.state.query,
                    page: 1,
                },
            },
            this.refreshList,
        );
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

    handleIsOver = async (event) => {
        const target = event.target;
        const name = target.name;

        const res = await changeIsOver(name);

        if (res.status === 200) {
            this.refreshList();
        }
    };

    delete = async (id) => {
        const res = await deleteGathering(id);

        if (res.status === 204) {
            this.refreshList();
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.gatherings !== nState.gatherings) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.gatherings ? (
            <div className="flex flex-col justify-between">
                <div className="w-full h-auto mb-4 p-4 flex flex-row justify-between text-green-500">
                    <div className="w-50% h-full text-3xl">모임 관리하기</div>
                    <div className="w-30% flex flex-row justify-between text-2xl">
                        <Link to="/gathering/history">모임 예약 내역</Link>
                        <Link to="/gathering/add">+ 모임 추가</Link>
                    </div>
                </div>

                <div className="mb-4 p-4 flex flex-col bg-green-500 text-white">
                    <div className="mb-2 font-bold text-2xl">필터</div>

                    <CheckButtonGroup
                        title="모임 종류"
                        check={[
                            {
                                title: '행사',
                                name: 'event',
                            },
                            {
                                title: '강좌',
                                name: 'lecture',
                            },
                            {
                                title: '읽기모임',
                                name: 'reading',
                            },
                        ]}
                        checked={this.state.filterA}
                        onChange={this.handleFilterA}
                    />

                    <CheckButtonGroup
                        title="신청 가능 여부"
                        check={[
                            {
                                title: '다가오는 모임',
                                name: 'upcoming',
                            },
                            {
                                title: '지난 모임',
                                name: 'past',
                            },
                        ]}
                        checked={this.state.filterB}
                        onChange={this.handleFilterB}
                    />

                    <TextInput
                        title="모임 이름"
                        value={this.state.filterD}
                        onChange={this.handleFilterD}
                        onClick={this.handleSearch}
                    />
                </div>

                <GatheringList
                    gatherings={this.state.gatherings}
                    onIsOverChange={this.handleIsOver}
                    delete={this.delete}
                />

                <button
                    className="relative mx-auto w-10% h-12 text-white"
                    onClick={this.handleMore}
                >
                    <img className="w-full" src={triangle} alt="" />
                </button>
            </div>
        ) : (
            <div className="text-xl text-green-500">loading</div>
        );
    }
}

const MapStateToProps = (state) => ({});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(Gathering);

function CheckButton(props) {
    return (
        <div>
            <label> {props.title} </label>
            <input
                className="ml-2 my-auto border border-white bg-green-500"
                name={props.name}
                type="checkbox"
                checked={props.checked}
                onChange={props.checkOnChange}
            />
        </div>
    );
}

function CheckButtonGroup(props) {
    return (
        <div className="mb-2 grid grid-cols-12 ">
            <div className="col-start-1 col-end-3 text-lg"> {props.title} </div>
            <div className="lg:col-start-3 lg:col-end-6 sm:col-start-4 sm:col-end-9 flex flex-row justify-between">
                {props.check.map((item, index) => {
                    return (
                        <CheckButton
                            key={index}
                            title={item.title}
                            name={item.name}
                            checked={props.checked[item.name]}
                            checkOnChange={props.onChange}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function TextInput(props) {
    return (
        <div className="grid grid-cols-12 ">
            <div className="col-start-1 col-end-3 text-lg"> {props.title} </div>
            <div className="col-start-3 col-end-10 flex flex-row justify-between">
                <input
                    className="pl-2 w-85% text-black text-base"
                    name={props.name}
                    type="text"
                    value={props.value}
                    onChange={props.onChange}
                />
                <button
                    className="w-10% bg-white text-green-500"
                    type="button"
                    onClick={props.onClick}
                >
                    검색
                </button>
            </div>
        </div>
    );
}

function GatheringList(props) {
    return (
        <div className="flex flex-col">
            {props.gatherings.map((g, index) => {
                return (
                    <div className="mb-4">
                        <GatheringItem
                            key={index}
                            gathering={g}
                            onIsOverChange={props.onIsOverChange}
                            delete={props.delete}
                        />
                    </div>
                );
            })}
        </div>
    );
}

function GatheringItem(props) {
    const gathering = props.gathering;

    const oncePrice = gathering.oncePrice ? priceStr(gathering.oncePrice) : null;
    const fullPrice = gathering.fullPrice ? priceStr(gathering.fullPrice) : null;
    const fullDate = gathering.rangeDate ? rangeDateStr(gathering.rangeDate) : '';
    const oneDate = gathering.oneTimeDate ? oneTimeDateStr(gathering.oneTimeDate) : '';
    const time = gathering.time ? timeStr(gathering.time) : null;

    return (
        <div className="relative overflow-hidden">
            <div className="w-full h-full p-4 grid grid-cols-12 border border-green-500">
                <div className="mr-6 col-start-1 col-end-4 border border-green-500">
                    <img className="w-full" src={gathering.mainImg.link} alt="img" />
                </div>
                <div className="col-start-4 col-end-9 flex flex-col justify-around text-green-500">
                    <p className="sm:font-bold">{gathering.format}</p>

                    <p className="lg:text-2xl sm:text-5xl">{gathering.title}</p>

                    <p>
                        일시:{' '}
                        {gathering.count === 1
                            ? oneDate + ' ' + time
                            : fullDate + ' ' + gathering.stringDate}
                    </p>
                    <p>장소: {gathering.place.name}</p>
                    <p>회차 수: {gathering.isAll ? '상시' : gathering.count + '회'}</p>
                    <p>
                        참가비:{' '}
                        {oncePrice
                            ? '1회 ' + oncePrice + '원 / 12회 ' + fullPrice + '원'
                            : fullPrice + '원'}
                    </p>
                </div>

                <div className="col-start-10 col-end-13 flex flex-col justify-start text-right text-green-500">
                    <div className="mb-4">
                        <label className="mr-4 text-xl">지난 모임</label>
                        <input
                            type="checkbox"
                            name={gathering.id}
                            checked={gathering.isOver}
                            onChange={props.onIsOverChange}
                        />
                    </div>
                    <div className="ml-auto mb-4 w-50% text-xl">
                        <Link to={'/gathering/edit/' + gathering.id} className="mr-8">
                            수정
                        </Link>
                        <button onClick={() => props.delete(gathering.id)}>삭제</button>
                    </div>

                    <div className="text-xl">
                        <Link to={'/gathering/people/' + gathering.id}>참가자 보기</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
