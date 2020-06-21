import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createText } from '../../util/api';

export default class AdminPlacesAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infos: {
                isShow: false,
                title: '',
                body: '',
                emphasis: '',
                date: '',
                writer: '',
            },
            label: {
                isShow: '표시',
                title: '제목',
                body: '내용',
                emphasis: '강조 내용',
                date: '끌 쓴 날',
                writer: '글쓴이',
            },
            caution: {
                isShow: '',
                title: '',
                body: '',
                emphasis: '',
                date: '',
                writer: '',
            },
        };
    }

    create = async () => {
        const infos = this.state.infos;
        const res = await createText(infos);
        if (res.status === 200) {
            window.location.href = '/about/texts';
        }
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        if (name === 'isShow') {
            this.setState({
                infos: {
                    ...this.state.infos,
                    [name]: !this.state.infos[name],
                },
            });
        } else {
            this.setState({
                infos: {
                    ...this.state.infos,
                    [name]: value,
                },
            });
        }
    };

    render() {
        return (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">소개글 추가하기</p>
                </div>

                <div className="w-full p-8 flex flex-col text-green-500 border border-green-500">
                    <div className="w-full h-auto mb-6 flex flex-col justify-between">
                        {Object.keys(this.state.infos).map((key, index) => {
                            if (key !== 'isShow' && key !== 'body') {
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
                            } else if (key === 'isShow') {
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
                            } else if (key === 'body') {
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
