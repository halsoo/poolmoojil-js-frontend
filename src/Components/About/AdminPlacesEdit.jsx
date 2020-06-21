import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getPlace, editPlace, uploadImage } from '../../util/api';

export default class AdminPlacesEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            place: undefined,
            infos: undefined,
            label: {
                name: '장소명',
                address: '주소',
                subAddress: '위치설명',
                weekday: '여는 날',
                weekdayOpen: '여는 날 오픈 시간',
                weekdayClose: '여는 날 마감 시간',
                shortday: '짧은 날',
                shortdayOpen: '짧은 날 오픈 시간',
                shortdayClose: '짧은 날 마감 시간',
                closing: '쉬는 날',
                phone: '전화',
                fax: '팩스',
                insta: '인스타',
                email: '이메일',
                mainImg: '이미지',
            },
            caution: {
                name: '장소명은 공란일 수 없습니다.',
                address: '주소는 공란일 수 없습니다.',
                subAddress: '(00역에서 0분 거리)등의 형식',
                weekday: '공란이 아닐 경우, 오픈과 마감 시간은 필수입니다.',
                weekdayOpen: 'hh:mm:ss 형식',
                weekdayClose: 'hh:mm:ss 형식',
                shortday: '공란이 아닐 경우, 오픈과 마감 시간은 필수입니다.',
                shortdayOpen: 'hh:mm:ss 형식',
                shortdayClose: 'hh:mm:ss 형식',
                closing: '',
                phone: '000-0000-0000 형식',
                fax: '000-0000-0000 형식',
                insta: '@instauser 형식',
                email: '',
                mainImg: '',
            },
        };

        this.loadPlace();
    }

    loadPlace = async () => {
        const place = await getPlace(this.props.match.params.id);
        if (place.status === 200) {
            this.setState({
                place: place.data,
                infos: {
                    id: place.data.id,
                    name: place.data.name,
                    address: place.data.address,
                    subAddress: place.data.subAddress,
                    weekday: place.data.weekday,
                    weekdayOpen: place.data.weekdayOpen,
                    weekdayClose: place.data.weekdayClose,
                    shortday: place.data.shortday,
                    shortdayOpen: place.data.shortdayOpen,
                    shortdayClose: place.data.shortdayClose,
                    closing: place.data.closing,
                    phone: place.data.phone,
                    fax: place.data.fax,
                    insta: place.data.insta,
                    email: place.data.email,
                    mainImg: undefined,
                },
            });
        }
    };

    edit = async () => {
        const infos = this.state.infos;
        const res = await editPlace(infos);
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
        if (this.state.place !== nState.place) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.place ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">장소 편집하기</p>
                </div>

                <div className="w-full p-8 flex flex-col text-green-500 border border-green-500">
                    <div className="w-full h-auto mb-6 flex flex-col justify-between">
                        {Object.keys(this.state.infos).map((key, index) => {
                            if (key !== 'mainImg') {
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
                            } else {
                                return (
                                    <FileInputWithLabel
                                        label={this.state.label[key]}
                                        onChange={this.handleFile}
                                        onClick={this.upload}
                                    />
                                );
                            }
                        })}
                    </div>
                    <button
                        className="w-30% h-16 mx-auto text-2xl text-white bg-green-500 border border-green-500"
                        onClick={() => this.edit(this.state.infos)}
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
                    placeholder={props.placeholder}
                    disabled={props.disabled}
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
