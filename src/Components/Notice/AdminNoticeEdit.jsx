import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { editNotice, uploadImage, getNoticeByID } from '../../util/api';

export default class AdminTextsEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notice: undefined,
            infos: undefined,
            label: {
                title: '제목',
                desc: '내용',
                img: '이미지',
            },
            caution: {
                title: '공란일 수 없습니다.',
                desc: '공란일 수 없습니다.',
            },
        };

        this.loadNotice();
    }

    loadNotice = async () => {
        const res = await getNoticeByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState({
                notice: res.data,
                infos: {
                    id: res.data.id,
                    title: res.data.title,
                    desc: res.data.desc,
                    img: res.data.img,
                },
            });
        }
    };

    edit = async () => {
        const infos = this.state.infos;
        const res = await editNotice(infos);
        if (res.status === 200) {
            window.location.reload(false);
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
                    img: res.data.location,
                },
            });
        }
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            infos: {
                ...this.state.infos,
                [name]: value,
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
        if (this.state.notice !== nState.notice) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.notice ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">공지 편집하기</p>
                </div>

                <div className="w-full p-8 flex flex-col text-green-500 border border-green-500">
                    <div className="w-full h-auto mb-6 flex flex-col justify-between">
                        {Object.keys(this.state.infos).map((key, index) => {
                            if (key !== 'desc' && key !== 'id' && key !== 'img') {
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
                            } else if (key === 'img') {
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
                        onClick={this.edit}
                    >
                        수정하기
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
