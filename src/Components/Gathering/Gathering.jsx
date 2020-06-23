import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ko';
import './calendar.css';

import { getGatherings, getGatheringsCalendar } from '../../util/api';
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

        this.loadCalendar();
        this.loadReadingPast();
        this.loadLecturePast();
        this.refreshList();
    }

    loadReadingPast = async () => {
        const query = {
            category: '읽기모임',
            isOver: false,
            page: 1,
            offset: 3,
        };
        const res = await getGatherings(query);
        if (res.status === 200) {
            this.setState({
                readingPast: res.data,
            });
        }
    };

    loadLecturePast = async () => {
        const query = {
            category: '강좌',
            isOver: true,
            page: 1,
            offset: 3,
        };
        const res = await getGatherings(query);
        if (res.status === 200) {
            this.setState({
                lecturePast: res.data,
            });
        }
    };

    loadCalendar = async () => {
        const res = await getGatheringsCalendar();
        let events = [];

        if (res.status === 200) {
            for (const event of res.data) {
                events.push({
                    start: moment(event.start, 'YYYY-MM-DD').toDate(),
                    end: moment(event.end, 'YYYY-MM-DD').toDate(),
                    title: <Link to={`/gathering/${event.id}`}>{event.title}</Link>,
                });
            }

            this.setState({
                calendar: events,
            });
        }
    };

    refreshList = async () => {
        const query = this.state.query;
        const queryList = {
            category: query.category,
            isOver: query.isOver,
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
            place: query.place,
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
    handleFilterC = (e) => {
        const target = e.target;
        const name = target.name;
        const pName = this.state.filterC[name];

        let place = undefined;

        switch (name) {
            case 'seoul':
                place = '풀무질';
                break;
            case 'choonchun':
                place = '소락재';
                break;
        }

        if (pName === true) place = undefined;

        const checked = this.handleFilter(name, pName, this.state.filterC);

        this.setState({
            query: {
                ...this.state.query,
                place: place,
            },
            filterC: checked,
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

    shouldComponentUpdate(nProps, nState) {
        if (this.state.calendar !== nState.calendar || this.state.gatherings !== nState.gathering) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.calendar && this.state.gatherings ? (
            <div className="flex flex-col justify-between">
                <div className="w-full h-auto mb-4 p-4 flex flex-row border border-green-500">
                    <div className="sm:hidden w-25% h-full mr-4 ">
                        <img className="h-full w-full" src={gatheringImg} alt="gathering_img" />
                    </div>

                    <div className="flex flex-col justify-around text-green-500">
                        <div className="font-bold lg:text-2xl sm:text-6xl">풀무질 모임</div>

                        <GatheringTypeDesc
                            title="읽기모임"
                            mainDesc="풀무질이 선정한 주제와 관련되니 책을 읽고 매월 정해진 날에 모여
                                토론하는 상설 모임입니다."
                            subDesc="회비 만원, 연회비 10만원"
                            pastList={this.state.readingPast}
                        />

                        <GatheringTypeDesc
                            title="강좌"
                            mainDesc="풀무질이 초빙한 강사와 함께 특정 주제를 심도 있게 공부하는
                            모임입니다."
                            subDesc="3개월 단위, 즉 계절 별로 강좌 일정을 기획. 주로 8회 내외.
                            수강료 16만원 수준 일괄 수납."
                            pastList={this.state.lecturePast}
                        />

                        <GatheringTypeDesc
                            title="행사"
                            mainDesc="출판기념회, 저자와의 만남, 워크숍 등 풀무질이 때에 따라 기획하는 일회성 모임입니다."
                            subDesc="참가비 만원 내외"
                        />
                    </div>
                </div>

                <div className="mb-4 p-4 flex flex-col border border-green-500">
                    <div className="font-bold lg:text-2xl sm:text-5xl text-green-500">
                        월별 모임 일정
                    </div>
                    <Calendar
                        localizer={localizer}
                        defaultDate={new Date()}
                        defaultView="month"
                        events={this.state.calendar}
                        formats={{
                            monthHeaderFormat: 'YYYY' + '년 ' + 'MM' + '월',
                        }}
                        startAccessor="start"
                        endAccessor="end"
                        views={['month']}
                        culture="kor"
                        style={{
                            height: '70vh',
                        }}
                    />
                </div>

                <div className="mb-4 p-4 flex flex-col bg-green-500 text-white">
                    <div className="mb-2 font-bold lg:text-2xl sm:text-5xl">필터</div>

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

                    {/* <CheckButtonGroup
                        title="장소"
                        check={[
                            {
                                title: '풀무질 본점',
                                name: 'seoul',
                            },
                            {
                                title: '소락재',
                                name: 'choonchun',
                            },
                        ]}
                        checked={this.state.filterC}
                        onChange={this.handleFilterC}
                    /> */}

                    <TextInput
                        title="모임 이름"
                        value={this.state.filterD}
                        onChange={this.handleFilterD}
                        onClick={this.handleSearch}
                    />
                </div>

                <GatheringList gatherings={this.state.gatherings} />

                <button
                    className="relative mx-auto w-10% h-18 text-white"
                    onClick={this.handleMore}
                >
                    <img className="w-full" src={triangle} alt="" />
                </button>
            </div>
        ) : (
            <div className="lg:text-xl sm:text-5xl text-green-500">loading</div>
        );
    }
}

const MapStateToProps = (state) => ({});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(Gathering);

function GatheringTypeDesc(props) {
    return (
        <div>
            <div className="mb-4">
                <h2 className="lg:text-xl sm:text-4xl">{props.title}</h2>

                <p className="sm:text-4xl">{props.mainDesc}</p>
                <p className="sm:text-4xl">({props.subDesc})</p>
            </div>

            {props.pastList ? (
                <div>
                    {props.title === '읽기모임' ? (
                        props.pastList.map((item, index) => {
                            return (
                                <div key={index} className="mb-4 sm:text-4xl">
                                    <p>
                                        {item.title} {item.speaker ? `(${item.speaker})` : null}
                                    </p>
                                    <p>{item.stringDate}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div>
                            <p className="sm:text-4xl">과거 강좌: </p>
                            {props.pastList.map((item, index) => {
                                return (
                                    <div key={index} className="flex mb-4 sm:text-4xl">
                                        <p>
                                            {item.title}{' '}
                                            {index === props.pastList.length - 1 ? null : ', '}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}

function CheckButton(props) {
    return (
        <div>
            <label className="sm:text-4xl"> {props.title} </label>
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
            <div className="col-start-1 col-end-3 lg:text-lg sm:text-4xl"> {props.title} </div>
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
            <div className="col-start-1 col-end-3 lg:text-lg sm:text-4xl"> {props.title} </div>
            <div className="col-start-3 col-end-10 flex flex-row justify-between">
                <input
                    className="pl-2 w-85% text-black text-base"
                    name={props.name}
                    type="text"
                    value={props.value}
                    onChange={props.onChange}
                />
                <button
                    className="w-10% bg-white text-green-500 sm:text-4xl"
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
                        <GatheringItem key={index} gathering={g} />
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
                    <Link className="text-2xl" to={`/gathering/${gathering.id}`}>
                        <img className="w-full" src={gathering.mainImg.link} alt="img" />
                    </Link>
                </div>
                <div className="col-start-4 col-end-13 flex flex-col justify-around text-green-500">
                    <p className="sm:font-bold sm:text-4xl">{gathering.format}</p>
                    <Link to={`/gathering/${gathering.id}`}>
                        <p className="lg:text-2xl sm:text-6xl">{gathering.title}</p>
                    </Link>
                    <p className="sm:text-4xl">
                        일시:{' '}
                        {gathering.count === 1
                            ? oneDate + ' ' + time
                            : fullDate + ' ' + gathering.stringDate}
                    </p>
                    <p className="sm:text-4xl">장소: {gathering.place.name}</p>
                    <p className="sm:text-4xl">
                        회차 수: {gathering.isAll ? '상시' : gathering.count + '회'}
                    </p>
                    <p className="sm:text-4xl">
                        참가비:{' '}
                        {oncePrice
                            ? '1회 ' + oncePrice + '원 / 12회 ' + fullPrice + '원'
                            : fullPrice + '원'}
                    </p>
                </div>

                {gathering.isOver ? (
                    <div className="w-48 h-10 absolute top-2 -right-10 transform origin-center rotate-45 flex bg-purple-500 tracking-widest text-white text-xl">
                        <p className="absolute top-1 left-18">지난 모임</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
