import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { uploadImage, createGathering } from '../../util/api';

export default class AdminGatheringAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gathering: undefined,
            infos: {
                title: null,
                count: null,
                oncePrice: null,
                fullPrice: null,
                rangeDate: null,
                oneTimeDate: null,
                time: null,
                stringDate: null,
                isAll: false,
                place: null,
                category: null,
                format: null,
                speaker: null,
                books: { 0: null },
                desc: null,
                mainImg: undefined,
                liveLink: null,
            },
            label: {
                title: '모임명',
                count: '회차 수',
                oncePrice: '1회 참가비',
                fullPrice: '참가비',
                rangeDate: '모임 기간',
                oneTimeDate: '일시',
                time: '시각',
                stringDate: '모임주기',
                isAll: '상시 여부',
                place: '장소',
                category: '종류',
                format: '포맷',
                speaker: '연사',
                books: '텍스트',
                desc: '내용',
                mainImg: '이미지',
                liveLink: '라이브 링크',
            },
            caution: {
                title: '공란일 수 없습니다.',
                count: '상시일 경우 불필요',
                oncePrice: '상시 읽기모임 전용',
                fullPrice: '강연료, 세미나 참가비 등',
                rangeDate: '[YYYY-MM-DD,YYYY-MM-DD] 형식 / 강좌 등 기간이 있는 경우',
                oneTimeDate: 'YYYY-MM-DD 형식 / 세미나 등 일회성인 경우',
                time: 'hh:mm:ss 형식',
                stringDate: '매월 첫/둘/셋/넷째 0요일 형식 / 강좌, 읽기모임',
                isAll: '상시 여부',
                place: '장소',
                category: '',
                format: '',
                speaker: '공란일 수 있음',
                books: '장터의 책 제목을 정확하게 입력',
                desc: '공란일 수 없음',
                liveLink: '',
            },
        };
    }

    create = async () => {
        const infos = this.state.infos;

        let str = [];
        if (infos.title === null || infos.title === '') {
            str.push('제목');
        }
        if (infos.place === null) {
            str.push('장소');
        }
        if (infos.category === null) {
            str.push('종류');
        }
        if (infos.format === null) {
            str.push('포맷');
        }
        if (infos.desc === null || infos.desc === '') {
            str.push('내용');
        }

        console.log(str);

        if (str.length !== 0) {
            alert(
                '다음과 같은 항목을 점검해주세요.' +
                    '\n' +
                    str.map((s, index) => {
                        if (index === str.length - 1) return s;
                        else return s;
                    }),
            );
        } else {
            const res = await createGathering(infos);
            if (res.status === 200) {
                window.location.href = '/gathering';
            }
        }
    };

    upload = async () => {
        const data = new FormData();
        data.append('file', this.state.file);
        const res = await uploadImage(data);

        if (res.status === 200) {
            alert('업로드 완료');
            this.setState({
                infos: {
                    ...this.state.infos,
                    mainImg: res.data.location,
                },
            });
        }
    };

    addBook = () => {
        const books = this.state.infos.books;
        const keys = Object.keys(books);
        const maxIndex = Math.max(...keys);

        const newIndex = maxIndex + 1;

        books[newIndex] = null;
        this.setState({
            infos: {
                ...this.state.infos,
                books: books,
            },
        });
    };

    deleteBook = () => {
        const books = this.state.infos.books;
        const keys = Object.keys(books);
        const maxIndex = Math.max(...keys);

        if (maxIndex !== 0) {
            delete books[maxIndex];
        }

        this.setState({
            infos: {
                ...this.state.infos,
                books: books,
            },
        });
    };

    handlePlace = (e) => {
        const target = e.target;
        const value = target.value;

        this.setState({
            infos: {
                ...this.state.infos,
                place: value,
            },
        });
    };

    handleCategory = (e) => {
        const target = e.target;
        const value = target.value;

        this.setState({
            infos: {
                ...this.state.infos,
                category: value,
            },
        });
    };

    handleFormat = (e) => {
        const target = e.target;
        const value = target.value;

        this.setState({
            infos: {
                ...this.state.infos,
                format: value,
            },
        });
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value === '' ? null : target.value;
        if (name === 'isAll') {
            this.setState({
                infos: {
                    ...this.state.infos,
                    [name]: !this.state.infos[name],
                },
            });
        } else if (name.includes('book')) {
            const bookNum = name.substring(6);
            const infoBooks = this.state.infos.books;

            infoBooks[bookNum] = value;

            this.setState({
                infos: {
                    ...this.state.infos,
                    books: infoBooks,
                },
            });
        } else if (name === 'oncePrice' || name === 'fullPrice' || name === 'count') {
            const change = parseInt(value);

            this.setState({
                infos: {
                    ...this.state.infos,
                    [name]: change,
                },
            });
        } else {
            let change = value;
            if (value === '') change = null;
            this.setState({
                infos: {
                    ...this.state.infos,
                    [name]: change,
                },
            });
        }
    };

    handleFile = (event) => {
        const target = event.target;
        const files = target.files;

        this.setState({
            file: files[0],
        });
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.gathering !== nState.gathering) {
            return true;
        }

        return true;
    }

    render() {
        return (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">모임 관리하기</p>
                </div>

                <div className="w-full p-8 flex flex-col text-green-500 border border-green-500">
                    <div className="w-full h-auto mb-6 flex flex-col justify-between">
                        {Object.keys(this.state.infos).map((key, index) => {
                            if (
                                key !== 'id' &&
                                key !== 'mainImg' &&
                                key !== 'desc' &&
                                key !== 'format' &&
                                key !== 'category' &&
                                key !== 'isAll' &&
                                key !== 'books' &&
                                key !== 'place' &&
                                key !== 'oncePrice'
                            ) {
                                return (
                                    <InputWithLabel
                                        label={this.state.label[key]}
                                        type="text"
                                        name={key}
                                        onChange={this.handleChange}
                                        value={this.state.infos[key]}
                                        caution={this.state.caution[key]}
                                    />
                                );
                            } else if (key === 'mainImg') {
                                return (
                                    <FileInputWithLabel
                                        label={this.state.label[key]}
                                        onChange={this.handleFile}
                                        onClick={this.upload}
                                    />
                                );
                            } else if (key === 'desc') {
                                return (
                                    <TextAreaWithLabel
                                        label={this.state.label[key]}
                                        type="textarea"
                                        name={key}
                                        onChange={this.handleChange}
                                        value={this.state.infos[key]}
                                        caution={this.state.caution[key]}
                                    />
                                );
                            } else if (key === 'isAll') {
                                return (
                                    <InputWithLabel
                                        label={this.state.label[key]}
                                        type="checkbox"
                                        name={key}
                                        onChange={this.handleChange}
                                        checked={this.state.infos[key]}
                                        caution={this.state.caution[key]}
                                    />
                                );
                            } else if (key === 'books') {
                                return (
                                    <ListedItems
                                        name={key}
                                        items={this.state.infos[key]}
                                        label={this.state.label[key]}
                                        onChange={this.handleChange}
                                        caution={this.state.caution[key]}
                                        onAddClick={this.addBook}
                                        onDeleteClick={this.deleteBook}
                                    />
                                );
                            } else if (key === 'place') {
                                return (
                                    <PlaceSelector
                                        selectValue={this.state.infos[key]}
                                        selectOnChange={this.handlePlace}
                                    />
                                );
                            } else if (key === 'category') {
                                return (
                                    <CategorySelector
                                        selectValue={this.state.infos[key]}
                                        selectOnChange={this.handleCategory}
                                    />
                                );
                            } else if (key === 'format') {
                                return (
                                    <FormatSelector
                                        selectValue={this.state.infos[key]}
                                        selectOnChange={this.handleFormat}
                                    />
                                );
                            }
                        })}
                    </div>
                    <button
                        className="w-30% h-16 mx-auto text-2xl text-white bg-green-500 border border-green-500"
                        onClick={this.create}
                    >
                        추가 하기
                    </button>
                </div>
            </div>
        );
    }
}

function InputWithLabel(props) {
    return (
        <div className="w-full mb-4 grid grid-cols-12">
            <div className="mr-3 col-start-1 col-end-9 flex flex-row justify-between">
                <label className="mr-6 text-xl text-green-500">{props.label}</label>
                <input
                    className="w-60% pl-2 border border-green-500 sm:rounded-none"
                    type={props.type}
                    name={props.name}
                    onChange={props.onChange}
                    value={props.value}
                    checked={props.checked}
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                />
            </div>
            <div className="col-start-9 col-end-13 flex flex-row">{props.caution}</div>
        </div>
    );
}

function TextAreaWithLabel(props) {
    return (
        <div className="w-full mb-4 grid grid-cols-12">
            <div className="mr-3 col-start-1 col-end-9 flex flex-row justify-between">
                <label className="mr-6 text-xl text-green-500">{props.label}</label>
                <textarea
                    className="w-60% pl-2 border border-green-500 sm:rounded-none"
                    name={props.name}
                    onChange={props.onChange}
                    value={props.value}
                />
            </div>
            <div className="col-start-9 col-end-13 flex flex-row">{props.caution}</div>
        </div>
    );
}

function FileInputWithLabel(props) {
    return (
        <div className="w-70% mb-4 grid grid-cols-12">
            <div className="col-start-1 col-end-13 flex flex-row justify-between">
                <label className="mr-6 text-xl text-green-500">{props.label}</label>
                <div className="w-60% flex flex-row justify-between">
                    <input
                        className="w-70% pl-2 border border-green-500 sm:rounded-none"
                        type="file"
                        name="file"
                        onChange={props.onChange}
                    />
                    <button
                        onClick={props.onClick}
                        className="w-20% h-auto text-white bg-green-500 border border-green-500"
                    >
                        업로드
                    </button>
                </div>
            </div>
        </div>
    );
}

function ListedItems(props) {
    return (
        <div>
            {Object.keys(props.items).map((key, index) => {
                return (
                    <InputWithLabel
                        key={index}
                        label={props.label}
                        type="text"
                        name={props.name + '-' + index.toString()}
                        value={props.items[key]}
                        onChange={props.onChange}
                        caution={props.caution}
                        additionalButton={true}
                    />
                );
            })}
            <div className="w-full mb-4 grid grid-cols-12">
                <button
                    onClick={props.onDeleteClick}
                    className="w-full h-8 col-start-4 col-end-6 text-white bg-green-500"
                >
                    텍스트 제거
                </button>

                <button
                    onClick={props.onAddClick}
                    className="w-full h-8 col-start-7 col-end-9 text-white bg-green-500"
                >
                    텍스트 추가
                </button>
            </div>
        </div>
    );
}

function PlaceSelector(props) {
    return (
        <div className="mb-4 grid grid-cols-12">
            <div className="col-start-1 col-end-4 text-xl">장소</div>
            <select
                className="col-start-4 col-end-7"
                value={props.selectValue}
                onChange={props.selectOnChange}
            >
                <option value="">장소 선택</option>
                <option value="풀무질">풀무질</option>
                <option value="소락재">소락재</option>
            </select>
        </div>
    );
}

function CategorySelector(props) {
    return (
        <div className="mb-4 grid grid-cols-12">
            <div className="col-start-1 col-end-4 text-xl">종류</div>
            <select
                className="col-start-4 col-end-7"
                value={props.selectValue}
                onChange={props.selectOnChange}
            >
                <option value="">종류 선택</option>
                <option value="행사">행사</option>
                <option value="강좌">강좌</option>
                <option value="읽기모임">읽기모임</option>
            </select>
        </div>
    );
}

function FormatSelector(props) {
    return (
        <div className="mb-4 grid grid-cols-12">
            <div className="col-start-1 col-end-4 text-xl">포맷</div>
            <select
                className="col-start-4 col-end-7"
                value={props.selectValue}
                onChange={props.selectOnChange}
            >
                <option value="">포맷 선택</option>
                <option value="출판기념회">출판기념회</option>
                <option value="저자와의 만남">저자와의 만남</option>
                <option value="워크숍">워크숍</option>
                <option value="강좌">강좌</option>
                <option value="읽기모임">읽기모임</option>
            </select>
        </div>
    );
}
