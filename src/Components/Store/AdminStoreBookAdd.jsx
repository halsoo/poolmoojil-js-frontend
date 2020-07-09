import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { uploadImage, createBook } from '../../util/api';
import { priceStr, priceStrToInt } from '../../util/localeStrings';

export default class AdminStoreBookEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: undefined,
            infos: {
                type: '',
                quantity: '',
                title: '',
                price: '',
                author: '',
                translator: '',
                publishingCompany: '',
                editor: '',
                designer: '',
                publisher: '',
                publishDate: '',
                ISBN: '',
                pages: '',
                dimensions: '',
                weights: '',
                desc: '',
                mainImg: '',
                additionalImg: '',
                monthlyCurations: { 0: null },
            },
            label: {
                type: '분류',
                quantity: '수량',
                monthlyCurations: '이달의 책',
                title: '도서명',
                price: '가격',
                author: '지은이',
                translator: '옮긴이',
                publishingCompany: '출판사',
                editor: '편집자',
                designer: '디자이너',
                publisher: '편낸이',
                pages: '쪽수',
                publishDate: '출간일',
                ISBN: 'ISBN',
                dimensions: '크기',
                weights: '무게',
                desc: '내용',
                mainImg: '이미지',
                additionalImg: '추가 이미지',
            },
            caution: {
                type: '베스트셀러 혹은 공란',
                quantity: '',
                monthlyCurations: 'YYYY-MM-DD DD는 그 주의 월요일',
                title: '',
                author: '',
                translator: '미해당 시 공란',
                publishingCompany: '미해당 시 공란',
                pages: '숫자',
                price: ', 없이 작성',
                editor: '미해당 시 공란',
                designer: '미해당 시 공란',
                publisher: '미해당 시 공란',
                publishDate: 'YYYY-MM-DD 형식',
                ISBN: '미해당 시 공란',
                dimensions: '가로*세로(*높이) 형식',
                weights: '숫자 ","제외',
                desc: '내용이 공란일 경우 다시 접근할 수 없습니다.',
                mainImg: '',
                additionalImg: '',
            },
            files: [],
        };
    }

    add = async () => {
        const infos = this.state.infos;

        let str = [];
        if (infos.title === null || infos.title === '') {
            str.push('도서명');
        }
        if (infos.author === null || infos.author === '') {
            str.push('지은이');
        }
        if (infos.publishingCompany === null || infos.publishingCompany === '') {
            str.push('출판사');
        }
        if (infos.pages === null || infos.pages === '') {
            str.push('쪽수');
        }
        if (infos.price === null || infos.price === '') {
            str.push('가격');
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
            const res = await createBook(infos);
            if (res.status === 200) {
                window.location.href = '/store/book';
            }
        }
    };

    addMonthly = () => {
        const monthlyCurations = this.state.infos.monthlyCurations;
        const keys = Object.keys(monthlyCurations);
        const maxIndex = Math.max(...keys);

        const newIndex = maxIndex + 1;

        monthlyCurations[newIndex] = null;
        this.setState({
            infos: {
                ...this.state.infos,
                monthlyCurations: monthlyCurations,
            },
        });
    };

    deleteMonthly = () => {
        const monthlyCurations = this.state.infos.monthlyCurations;
        const keys = Object.keys(monthlyCurations);
        const maxIndex = Math.max(...keys);

        if (maxIndex !== 0) {
            delete monthlyCurations[maxIndex];
        }

        this.setState({
            infos: {
                ...this.state.infos,
                monthlyCurations: monthlyCurations,
            },
        });
    };

    upload = async (event) => {
        const name = event.target.name;
        const data = new FormData();
        data.append('file', this.state.file);
        const res = await uploadImage(data);

        if (res.status === 200) {
            alert('업로드 완료');
            this.setState({
                infos: {
                    ...this.state.infos,
                    [name]: res.data.location,
                },
            });
        }
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value === '' ? null : target.value;
        if (name.includes('monthlyCuration')) {
            const bookNum = name.substring(17);
            const infoBooks = this.state.infos.monthlyCurations;

            infoBooks[bookNum] = value;

            this.setState({
                infos: {
                    ...this.state.infos,
                    monthlyCurations: infoBooks,
                },
            });
        } else if (name === 'price') {
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
        const name = target.name;

        this.setState({
            [name]: files[0],
        });
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.book !== nState.book) {
            return true;
        }

        return true;
    }

    render() {
        return (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">도서 관리하기</p>
                </div>

                <div className="w-full p-8 flex flex-col text-green-500 border border-green-500">
                    <div className="w-full h-auto mb-6 flex flex-col justify-between">
                        {Object.keys(this.state.infos).map((key, index) => {
                            if (
                                key !== 'id' &&
                                key !== 'mainImg' &&
                                key !== 'desc' &&
                                key !== 'additionalImg' &&
                                key !== 'monthlyCurations'
                            ) {
                                return (
                                    <InputWithLabel
                                        key={index}
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
                                        key={index}
                                        label={this.state.label[key]}
                                        onChange={this.handleFile}
                                        name={key}
                                        onClick={this.upload}
                                    />
                                );
                            } else if (key === 'additionalImg') {
                                return (
                                    <FileInputWithLabel
                                        key={index}
                                        label={this.state.label[key]}
                                        name={key}
                                        onChange={this.handleFile}
                                        onClick={this.upload}
                                    />
                                );
                            } else if (key === 'desc') {
                                return (
                                    <TextAreaWithLabel
                                        key={index}
                                        label={this.state.label[key]}
                                        type="textarea"
                                        name={key}
                                        onChange={this.handleChange}
                                        value={this.state.infos[key]}
                                        caution={this.state.caution[key]}
                                    />
                                );
                            } else if (key === 'monthlyCurations') {
                                return (
                                    <ListedItems
                                        key={index}
                                        name={key}
                                        items={this.state.infos[key]}
                                        label={this.state.label[key]}
                                        onChange={this.handleChange}
                                        caution={this.state.caution[key]}
                                        onAddClick={this.addMonthly}
                                        onDeleteClick={this.deleteMonthly}
                                    />
                                );
                            }
                        })}
                    </div>
                    <button
                        className="w-30% h-16 mx-auto text-2xl text-white bg-green-500 border border-green-500"
                        onClick={this.add}
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
                        name={props.name}
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
                    날짜 제거
                </button>

                <button
                    onClick={props.onAddClick}
                    className="w-full h-8 col-start-7 col-end-9 text-white bg-green-500"
                >
                    날짜 추가
                </button>
            </div>
        </div>
    );
}
