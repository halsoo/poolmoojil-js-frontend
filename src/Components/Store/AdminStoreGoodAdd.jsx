import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { uploadImage, createGood } from '../../util/api';
import { priceStr, priceStrToInt } from '../../util/localeStrings';

export default class AdminStoreGoodAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infos: {
                type: '',
                quantity: '',
                name: '',
                price: '',
                maker: '',
                designer: '',
                dimensions: '',
                color: '',
                desc: '',
                mainImg: '',
                additionalImg: '',
            },
            label: {
                type: '분류',
                quantity: '수량',
                name: '굿즈명',
                price: '가격',
                maker: '만든이',
                designer: '디자이너',
                dimensions: '크기',
                color: '색상',
                desc: '내용',
                mainImg: '이미지',
                additionalImg: '추가 이미지',
            },
            caution: {
                type: '',
                quantity: '숫자 ","제외',
                name: '',
                price: '숫자 ","제외',
                maker: '',
                designer: '',
                dimensions: '가로*세로(*높이) 형식',
                color: '',
                desc: '',
                mainImg: '',
                additionalImg: '',
            },
        };
    }

    add = async () => {
        const infos = this.state.infos;
        const res = await createGood(infos);
        if (res.status === 200) {
            window.location.reload(false);
        }
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
        const value = target.value;
        if (name === 'price') {
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
        if (this.state.good !== nState.good) {
            return true;
        }

        return true;
    }

    render() {
        return (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">굿즈 관리하기</p>
                </div>

                <div className="w-full p-8 flex flex-col text-green-500 border border-green-500">
                    <div className="w-full h-auto mb-6 flex flex-col justify-between">
                        {Object.keys(this.state.infos).map((key, index) => {
                            if (
                                key !== 'id' &&
                                key !== 'mainImg' &&
                                key !== 'desc' &&
                                key !== 'additionalImg'
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
