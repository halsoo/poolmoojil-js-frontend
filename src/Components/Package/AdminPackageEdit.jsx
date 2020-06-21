import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { uploadImage, getPackageByID, editPackage } from '../../util/api';
import { priceStr, priceStrToInt } from '../../util/localeStrings';

export default class AdminTextsEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            package: undefined,
            infos: undefined,
            label: {
                title: '꾸러미명',
                outOfStock: '',
                price: '가격',
                date: '년/월',
                monthlyCurated: '이 달의 책',
                desc: '내용',
                packageList: '구성품',
                mainImg: '이미지',
            },
            caution: {
                mainImg: '',
                title: '',
                outOfStock: '',
                price: '',
                date: 'YYYY-MM-01 형식으로 작성',
                monthlyCurated: '',
                desc: '',
                packageList: '',
            },
        };

        this.loadPackage();
    }

    loadPackage = async () => {
        const res = await getPackageByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState({
                package: res.data,
                infos: {
                    id: res.data.id,
                    title: res.data.title,
                    outOfStock: res.data.outOfStock,
                    price: priceStrToInt(priceStr(res.data.price)),
                    date: res.data.date,
                    monthlyCurated: res.data.monthlyCurated.book.title,
                    desc: res.data.desc,
                    packageList: res.data.packageList,
                    mainImg: res.data.mainImg.link,
                },
            });
        }
    };

    edit = async () => {
        const infos = this.state.infos;
        const res = await editPackage(infos);
        if (res.status === 200) {
            window.location.reload(false);
        }
    };

    upload = async () => {
        const data = new FormData();
        data.append('file', this.state.file);
        const res = await uploadImage(data);

        if (res.status === 200) {
            this.setState({
                infos: {
                    ...this.state.infos,
                    mainImg: res.data.location,
                },
            });
        }
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        let change = value;
        if (value === '') change = null;
        if (name === 'price') change = parseInt(change);
        this.setState({
            infos: {
                ...this.state.infos,
                [name]: change,
            },
        });
    };

    handleFile = (event) => {
        const target = event.target;
        const files = target.files;

        this.setState({
            file: files[0],
        });
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.package !== nState.package) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.package ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">꾸러미 관리하기</p>
                </div>

                <div className="w-full p-8 flex flex-col text-green-500 border border-green-500">
                    <div className="w-full h-auto mb-6 flex flex-col justify-between">
                        {Object.keys(this.state.infos).map((key, index) => {
                            if (
                                key !== 'id' &&
                                key !== 'mainImg' &&
                                key !== 'desc' &&
                                key !== 'outOfStock' &&
                                key !== 'monthlyCurated'
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
                            } else if (key === 'monthlyCurated') {
                                return (
                                    <InputWithLabel
                                        key={index}
                                        label={this.state.label[key]}
                                        type="text"
                                        name={key}
                                        value={this.state.infos[key]}
                                        caution={this.state.caution[key]}
                                    />
                                );
                            }
                        })}
                    </div>
                    <button
                        className="w-30% h-16 mx-auto text-2xl text-white bg-green-500 border border-green-500"
                        onClick={this.edit}
                    >
                        수정 하기
                    </button>
                </div>
            </div>
        ) : (
            <div className="text-xl text-green-500">loading</div>
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
