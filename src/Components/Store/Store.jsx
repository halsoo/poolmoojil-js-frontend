import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    getBookCurated,
    getBookSelected,
    getPackageMonthly,
    getGoods,
    getBooks,
} from '../../util/api';
import { priceStr, oneTimeMonthStr } from '../../util/localeStrings';

import triangle from '../../img/triangle.png';

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            query: {
                title: undefined,
                type: undefined,
                author: undefined,
                publishingCompany: undefined,
                page: 1,
                offset: 4,
            },
            filterA: {
                all: false,
                monthly: false,
                selected: false,
            },
            filterB: '',
            filterC: '',

            isSearched: false,

            curatedMonthly: undefined,
            packageMonthly: undefined,
            poolmoojilSelection: undefined,
            goods: undefined,
        };

        this.loadCuratedMonthly();
        this.loadPoolmoojilSelection();
        this.loadPackageMonthly();
        this.loadGoods();
    }

    loadCuratedMonthly = async () => {
        const query = {
            page: 1,
            offset: 1,
        };
        const res = await getBookCurated(query);
        if (res.status === 200) {
            this.setState({
                curatedMonthly: res.data[0],
            });
        }
    };

    loadPoolmoojilSelection = async () => {
        const query = {
            page: 1,
            offset: 3,
        };
        const res = await getBookSelected(query);
        if (res.status === 200) {
            this.setState({
                poolmoojilSelection: res.data,
            });
        }
    };

    loadPackageMonthly = async () => {
        const res = await getPackageMonthly();
        if (res.status === 200) {
            this.setState({
                packageMonthly: res.data,
            });
        }
    };

    loadGoods = async () => {
        const query = {
            page: 1,
            offset: 3,
        };
        const res = await getGoods(query);
        if (res.status === 200) {
            this.setState({
                goods: res.data,
            });
        }
    };

    refreshList = async () => {
        const query = this.state.query;
        let res = null;
        if (query.type === '이 달의 책') {
            const queryList = {
                page: 1,
                offset: query.offset,
            };

            res = await getBookCurated(queryList);
        } else {
            const queryList = {
                title: query.title,
                author: query.author,
                publishingCompany: query.publishingCompany,
                type: query.type === 'all' ? undefined : query.type,
                page: 1,
                offset: query.offset,
            };

            res = await getBooks(queryList);
        }
        if (res.status === 200) {
            let books = [];
            books.push(res.data);
            this.setState({
                books: books,
                query: {
                    ...this.state.query,
                    page: 1,
                },
            });
        }
    };

    pushList = async () => {
        const query = this.state.query;
        let res = null;
        if (query.type === '이 달의 책') {
            const queryList = {
                page: query.page,
                offset: query.offset,
            };

            res = await getBookCurated(queryList);
        } else {
            const queryList = {
                title: query.title,
                author: query.author,
                publishingCompany: query.publishingCompany,
                type: query.type === 'all' ? undefined : query.type,
                page: query.page,
                offset: query.offset,
            };

            res = await getBooks(queryList);
        }

        if (res.status === 200) {
            if (res.data.length !== 0) {
                let books = this.state.books;
                books.push(res.data);
                this.setState({
                    books: books,
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
        let checked = {};

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

        return checked;
    };

    handleFilterA = (e) => {
        const target = e.target;
        const name = target.name;
        const pName = this.state.filterA[name];

        let type = undefined;

        switch (name) {
            case 'all':
                type = 'all';
                break;
            case 'monthly':
                type = '이 달의 책';
                break;
            case 'selected':
                type = '풀무질 인문학 100선';
                break;
        }

        if (pName === true) type = undefined;

        const checked = this.handleFilter(name, pName, this.state.filterA);

        this.setState(
            {
                query: {
                    ...this.state.query,
                    type: type,
                },
                isSearched: true,
                filterA: checked,
            },
            this.refreshList,
        );
    };

    handleFilterB = (e) => {
        const target = e.target;
        const value = target.value;

        this.setState({
            query: {
                ...this.state.query,
                [this.state.filterB]: undefined,
            },
            filterB: value,
        });
    };

    handleFilterC = (e) => {
        const target = e.target;
        const value = target.value;
        let searchQuery = '%' + value + '%';

        if (value === '') searchQuery = undefined;
        this.setState({
            query: {
                ...this.state.query,
                [this.state.filterB]: searchQuery,
            },
            filterC: value,
        });
    };

    handleSearch = () => {
        this.setState(
            {
                isSearched: true,
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

    handleShowFull = (e, name) => {
        let type = null;

        switch (name) {
            case 'selected':
                type = '풀무질 인문학 100선';
                break;
            case 'monthly':
                type = '이 달의 책';
                break;
        }

        this.setState(
            {
                isSearched: true,
                query: {
                    ...this.state.query,
                    type: type,
                    page: 1,
                },
                filterA: {
                    ...this.state.filterA,
                    [name]: true,
                },
            },
            this.refreshList,
        );
    };

    render() {
        return (
            <div className="flex flex-col justify-between">
                <div className="mb-4 p-4 flex flex-col bg-green-500 text-white">
                    <div className="mb-2 font-bold text-2xl">도서 검색</div>

                    <ButtonGroup
                        title="도서 종류"
                        buttonState={this.state.filterA}
                        button={[
                            {
                                title: '전체',
                                name: 'all',
                            },
                            {
                                title: '이달의 책',
                                name: 'monthly',
                            },
                            {
                                title: '풀무질 인문학 100선',
                                name: 'selected',
                            },
                        ]}
                        onClick={this.handleFilterA}
                    />

                    <TextInput
                        title="검색"
                        selectValue={this.state.filterB}
                        selectOnChange={this.handleFilterB}
                        textValue={this.state.filterC}
                        textOnChange={this.handleFilterC}
                        onClick={this.handleSearch}
                    />
                </div>

                {this.state.isSearched && this.state.books ? (
                    <div className="flex flex-col justify-center">
                        <BookList books={this.state.books} />

                        <button
                            className="relative mx-auto mt-16 w-10% h-12 text-white"
                            onClick={this.handleMore}
                        >
                            <img className="w-full" src={triangle} alt="" />
                            <div className="absolute top-0 left-2vw">더보기</div>
                        </button>
                    </div>
                ) : null}

                <div className="h-full flex flex-row flex-wrap content-between items-stretch justify-between">
                    {!this.state.isSearched && this.state.curatedMonthly ? (
                        <MonthlyCurated
                            curation={this.state.curatedMonthly}
                            onClick={this.handleShowFull}
                        />
                    ) : null}
                    {!this.state.isSearched && this.state.poolmoojilSelection ? (
                        <ThreeItems
                            title="풀무질 인문학 100선"
                            name="selected"
                            items={this.state.poolmoojilSelection}
                            onClick={this.handleShowFull}
                            mb={true}
                        />
                    ) : null}
                    {!this.state.isSearched && this.state.packageMonthly ? (
                        <MonthlyPackage package={this.state.packageMonthly} />
                    ) : null}
                    {!this.state.isSearched && this.state.goods ? (
                        <ThreeItems title="풀무질 굿즈" name="goods" items={this.state.goods} />
                    ) : null}
                </div>
            </div>
        );
    }
}

const MapStateToProps = (state) => ({});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(Store);

function SingleButton(props) {
    return (
        <div>
            <button
                className={`mr-2 text-white ${props.buttonState ? 'font-bold' : 'font-regular'}`}
                name={props.name}
                type="button"
                onClick={props.onClick}
            >
                {props.title}
            </button>
        </div>
    );
}

function ButtonGroup(props) {
    return (
        <div className="mb-2 grid grid-cols-12 ">
            <div className="col-start-1 col-end-3 text-lg"> {props.title} </div>
            <div className="col-start-3 col-end-6 flex flex-row justify-between">
                {props.button.map((item, index) => {
                    return (
                        <SingleButton
                            key={index}
                            title={item.title}
                            buttonState={props.buttonState[item.name]}
                            name={item.name}
                            onClick={props.onClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function TextInput(props) {
    return (
        <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-3 text-lg"> {props.title} </div>
            <div className="col-start-3 col-end-4 text-lg text-green-500">
                <select name="filterB" value={props.selectValue} onChange={props.selectOnChange}>
                    <option value="">옵션 선택</option>
                    <option value="title">제목</option>
                    <option value="author">저자</option>
                    <option value="publishingCompany">출판사</option>
                </select>
            </div>
            <div className="col-start-4 col-end-10 pl-4 flex flex-row justify-between">
                <input
                    className="pl-2 w-85% text-black text-base"
                    type="text"
                    value={props.textValue}
                    onChange={props.textOnChange}
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

function BookList(props) {
    return (
        <div className="flex flex-col">
            {props.books.map((bookRow, index) => {
                const multirow = props.books.length > 1 ? true : false;
                return (
                    <div
                        className={`mb-8 flex flex-row ${
                            multirow ? 'justify-start' : 'justify-center'
                        }`}
                    >
                        {bookRow.map((b, index) => {
                            const book = b.book ? b.book[0] : b;
                            const end = (index + 1) % 4 === 0 ? true : false;
                            return <BookItem key={index} book={book} end={end} />;
                        })}
                    </div>
                );
            })}
        </div>
    );
}

function BookItem(props) {
    const book = props.book;
    const price = priceStr(book.price);

    return (
        <div
            className={`w-24% ${
                props.end ? 'mr-0' : 'mr-4'
            } flex flex-col items-stretch justify-between`}
        >
            <div className="h-full flex flex-col justify-center">
                <Link className="mx-auto" to={'/store/book/' + book.id}>
                    <img src={book.mainImg.link} alt="" />
                </Link>
            </div>

            <div className="flex flex-col justify-between text-lg text-green-500">
                <Link className="mx-auto" to={'/store/book/' + book.id}>
                    <p className="font-bold">{book.title}</p>
                </Link>
                <p className="mx-auto">{book.author}</p>
                <p className="mx-auto">{price}원</p>
            </div>
        </div>
    );
}

function MonthlyPackage(props) {
    const monthlyPackage = props.package;
    const month = oneTimeMonthStr(monthlyPackage.date);
    const price = priceStr(monthlyPackage.price);

    return (
        <div className="w-49% p-4 flex flex-col text-white bg-green-500 border border-green-500">
            <div className="mb-2 font-bold text-2xl">이 달의 꾸러미</div>
            <div className="h-full flex flex-row">
                <div className="w-40% h-auto my-auto flex border border-green-500">
                    <Link to={'/package/' + monthlyPackage.id}>
                        <img className="h-auto" src={monthlyPackage.mainImg.link} alt="" />
                    </Link>
                </div>

                <div className="w-80% my-auto ml-8 flex flex-col">
                    <p className="text-lg mb-2">{month}의 꾸러미</p>
                    <Link to={'/package/' + monthlyPackage.id}>
                        <p className="text-2xl mb-2">{monthlyPackage.title}</p>
                    </Link>
                    <p className="text-lg mb-2">{monthlyPackage.bookList[0].title}</p>
                    <p className="text-lg">가격: {price}원</p>
                </div>
            </div>
        </div>
    );
}

function MonthlyCurated(props) {
    const book = props.curation.book[0];
    const month = oneTimeMonthStr(props.curation.date);
    const price = priceStr(book.price);

    return (
        <div className="w-49% mb-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="w-full mb-2 flex flex-row justify-between">
                <div className="font-bold text-2xl">이 달의 책</div>
                <div>
                    <button
                        className="font-bold text-xl"
                        onClick={(e) => props.onClick(e, 'monthly')}
                    >
                        더보기
                    </button>
                </div>
            </div>
            <div className="h-full flex flex-row">
                <div className="w-40% my-auto flex justify-center border border-green-500">
                    <Link to={'/store/book/' + book.id}>
                        <img src={book.mainImg.link} alt="" />
                    </Link>
                </div>

                <div className="w-80% my-auto ml-8 flex flex-col">
                    <p className="text-lg mb-2">{month}의 책</p>
                    <Link to={'/store/book/' + book.id}>
                        <p className="text-2xl mb-2">{book.title}</p>
                    </Link>
                    <p className="text-lg mb-2">저자: {book.author}</p>
                    <p className="text-lg mb-2">출판사: {book.publishingCompany}</p>
                    <p className="text-lg">가격: {price}원</p>
                </div>
            </div>
        </div>
    );
}

function ThreeItems(props) {
    const mb = props.mb;
    return (
        <div
            className={`w-49% ${
                mb ? 'mb-4' : 'mb-0'
            } p-4 flex flex-col text-green-500 border border-green-500`}
        >
            <div className="w-full flex flex-row justify-between">
                <div className="mb-2 font-bold text-2xl">{props.title}</div>
                <div>
                    {props.name === 'goods' ? (
                        <Link className="font-bold text-xl" to="/store/good">
                            더보기
                        </Link>
                    ) : (
                        <button
                            className="font-bold text-xl"
                            onClick={(e) => props.onClick(e, props.name)}
                        >
                            더보기
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-row justify-between">
                {props.items.map((item, index) => {
                    return (
                        <div key={index} className="w-30% flex flex-col">
                            <Link
                                className="mx-auto font-bold"
                                to={item.name ? '/store/good/' + item.id : '/store/book/' + item.id}
                            >
                                <img className="mx-auto mb-2" src={item.mainImg.link} alt="" />
                            </Link>
                            <Link
                                className="mx-auto font-bold"
                                to={item.name ? '/store/good/' + item.id : '/store/book/' + item.id}
                            >
                                {item.name ? item.name : item.title}
                            </Link>
                            {item.author ? <p className="mx-auto">{item.author}</p> : null}
                            <p className="mx-auto">{priceStr(item.price) + '원'}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
