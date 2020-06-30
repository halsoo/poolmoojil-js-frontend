import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getBookCurated, getBooks, deleteBook } from '../../util/api';
import { priceStr, oneTimeMonthStr } from '../../util/localeStrings';

import triangle from '../../img/triangle.png';

export default class Store extends Component {
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
            isSearched: true,
            filterA: {
                all: false,
                monthly: false,
                selected: false,
            },
            filterB: '',
            filterC: '',
        };

        this.refreshList();
    }

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

    delete = async (id) => {
        const res = await deleteBook(id);

        if (res.status === 204) {
            this.refreshList();
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.isSearched && this.state.books !== nState.books) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.isSearched && this.state.books ? (
            <div className="flex flex-col sm:h-auto justify-between">
                <div className="w-full h-auto mb-4 p-4 flex flex-row justify-between text-green-500">
                    <div className="w-50% h-full text-3xl">도서 관리하기</div>
                    <div className="flex flex-row justify-between text-2xl">
                        <Link to="/store/book/add">+ 도서 추가</Link>
                    </div>
                </div>
                <div className="mb-4 sm:h-auto p-4 flex flex-col bg-green-500 text-white border border-green-500">
                    <div className="mb-2 font-bold lg:text-2xl sm:text-5xl">도서 검색</div>

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
                        <BookList books={this.state.books} delete={this.delete} />

                        <button
                            className="relative mx-auto mt-16 w-10% h-18 text-white"
                            onClick={this.handleMore}
                        >
                            <img className="w-full" src={triangle} alt="" />
                        </button>
                    </div>
                ) : null}
            </div>
        ) : (
            <div className="lg:text-xl sm:text-5xl text-green-500">loading</div>
        );
    }
}

function SingleButton(props) {
    return (
        <div>
            <button
                className={`mr-2 text-white sm:text-5xl ${
                    props.buttonState ? 'font-bold' : 'font-regular'
                }`}
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
            <div className="col-start-1 col-end-3 lg:text-lg sm:text-4xl"> {props.title} </div>
            <div className="lg:col-start-3 lg:col-end-6 sm:col-start-3 sm:col-end-9 flex flex-row justify-between">
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
            <div className="col-start-1 col-end-3 lg:text-lg sm:text-4xl"> {props.title} </div>
            <div className="col-start-3 lg:col-end-4 sm:col-end-5 lg:text-lg sm:text-4xl text-green-500">
                <select name="filterB" value={props.selectValue} onChange={props.selectOnChange}>
                    <option value="">옵션 선택</option>
                    <option value="title">제목</option>
                    <option value="author">저자</option>
                    <option value="publishingCompany">출판사</option>
                </select>
            </div>
            <div className="lg:col-start-4 sm:col-start-5 col-end-10 pl-4 flex flex-row justify-between">
                <input
                    className="pl-2 w-75% text-black text-base"
                    type="text"
                    value={props.textValue}
                    onChange={props.textOnChange}
                />
                <button
                    className="sm:text-4xl w-15% bg-white text-green-500"
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
                        key={index}
                        className={`mb-8 flex flex-row ${
                            multirow ? 'justify-start' : 'justify-center'
                        }`}
                    >
                        {bookRow.map((b, index) => {
                            const book = b.book ? b.book : b;
                            const end = (index + 1) % 4 === 0 ? true : false;
                            return (
                                <BookItem key={index} book={book} end={end} delete={props.delete} />
                            );
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
            <div className="h-full h-auto relative">
                {book.mainImg ? (
                    <img className="mx-auto" src={book.mainImg.link} alt="" />
                ) : (
                    <div classNAme="mx-auto bg-purpl-500" />
                )}
                <div className="absolute w-32 h-auto top-4 right-8 flex flex-col">
                    <Link
                        to={'/store/book/edit/' + book.id}
                        className="mb-4 p-4 text-center text-xl text-white bg-green-500"
                    >
                        수정
                    </Link>
                    <button
                        className="p-4 text-xl text-white bg-green-500"
                        onClick={() => props.delete(book.id)}
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="flex flex-col justify-between lg:text-lg sm:text-4xl text-green-500">
                <p className="font-bold mx-auto">{book.title}</p>

                <p className="mx-auto">{book.author}</p>
                <p className="mx-auto">{price}원</p>
            </div>
        </div>
    );
}
