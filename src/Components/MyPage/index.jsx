import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions';
import axios from 'axios';

import { isEmail, isLength, isAlphanumeric, isAscii, isNumeric } from 'validator';
import InputWithLabel from './InputWithLabel';
import ListedItems from './ListedItems';
import AddressSearch from '../shared/AddressSearch';
import NewWindow from 'react-new-window';

import { updateTry } from '../../actions';

class MyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: {
                overall: null,
                userID: null,
                name: null,
                email: null,
                password: null,
                passwordConfirm: null,
                phone: null,
                birth: null,
            },

            address: {
                zipCode: null,
                addressA: null,
                addressB: null,
            },

            IDokay: false,
            EMAILokay: false,

            buttonForm: {
                checkA: false,
                checkB: false,
            },

            popup: false,
        };

        window.name = 'parentWindow';
    }

    validate = {
        email: (value) => {
            if (!isEmail(value)) {
                this.setState({
                    error: {
                        ...this.state.error,
                        email: '잘못된 이메일 형식 입니다.',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    email: null,
                },
            });
            return true;
        },
        userID: (value) => {
            if (!isAlphanumeric(value) || !isLength(value, { min: 5, max: 20 })) {
                this.setState({
                    error: {
                        ...this.state.error,
                        userID: '아이디는 5~20 글자의 알파벳 혹은 숫자로 이뤄져야 합니다.',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    userID: null,
                },
            });
            return true;
        },
        password: (value) => {
            if (!isLength(value, { min: 8 })) {
                this.setState({
                    error: {
                        ...this.state.error,
                        password: '비밀번호를 8자 이상 입력하세요.',
                    },
                });
                return false;
            } else if (!isAscii(value)) {
                this.setState({
                    error: {
                        ...this.state.error,
                        password: '영문, 숫자, 특수문자만 사용해주세요.',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    password: null,
                },
            });
            return true;
        },
        passwordConfirm: (value) => {
            if (this.state.password !== value) {
                this.setState({
                    error: {
                        ...this.state.error,
                        passwordConfirm: '비밀번호가 다릅니다.',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    passwordConfirm: null,
                },
            });
            return true;
        },

        phoneA: (value) => {
            if (!isNumeric(value) || !isLength(value, { min: 3, max: 4 })) {
                this.setState({
                    error: {
                        ...this.state.error,
                        phone: '정확한 연락처를 입력해주세요',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    phone: null,
                },
            });
            return true;
        },
        phoneB: (value) => {
            if (!isNumeric(value) || !isLength(value, { min: 3, max: 4 })) {
                this.setState({
                    error: {
                        ...this.state.error,
                        phone: '정확한 연락처를 입력해주세요',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    phone: null,
                },
            });
            return true;
        },
        phoneC: (value) => {
            if (!isNumeric(value) || !isLength(value, { min: 4, max: 4 })) {
                this.setState({
                    error: {
                        ...this.state.error,
                        phone: '정확한 연락처를 입력해주세요',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    phone: null,
                },
            });
            return true;
        },

        birthA: (value) => {
            if (!isNumeric(value) || !isLength(value, { min: 0, max: 3000 })) {
                this.setState({
                    error: {
                        ...this.state.error,
                        birth: '정확한 생년월일 입력해주세요',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    birth: null,
                },
            });
            return true;
        },
        birthB: (value) => {
            if (!isNumeric(value) || !isLength(value, { min: 1, max: 12 })) {
                this.setState({
                    error: {
                        ...this.state.error,
                        birth: '정확한 생년월일 입력해주세요',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    birth: null,
                },
            });
            return true;
        },
        birthA: (value) => {
            if (!isNumeric(value) || !isLength(value, { min: 1, max: 31 })) {
                this.setState({
                    error: {
                        ...this.state.error,
                        birth: '정확한 생년월일 입력해주세요',
                    },
                });
                return false;
            }
            this.setState({
                error: {
                    ...this.state.error,
                    birth: null,
                },
            });
            return true;
        },
    };

    combine = (strA, strB, strC, isPhone) => {
        let result = null;
        if (isPhone) {
            result = strA + strB + strC;
        } else {
            if (strB.length < 2) strB = '0' + strB;
            if (strC.length < 2) strC = '0' + strC;
            result = strA + '-' + strB + '-' + strC;
        }

        return result;
    };

    update = async (event) => {
        const userID = this.state.userID;
        const name = this.state.name;
        const email = this.state.email;
        const password = this.state.password;
        const phone = this.combine(this.state.phoneA, this.state.phoneB, this.state.phoneC, true);
        const birth = this.combine(this.state.birthA, this.state.birthB, this.state.birthC, false);
        const zipCode = this.state.address.zipCode;
        const addressA = this.state.address.addressA;
        const addressB = this.state.addressB;

        const updateInfo = {
            userID,
            name,
            email,
            password,
            phone,
            birth,
            zipCode,
            addressA,
            addressB,
        };

        const errors = Object.values(this.state.error).reduce((a, b) => a + b, 0);
        const values = Object.keys(updateInfo).reduce((a, b) => {
            if (updateInfo[b] !== null) return a + null;
            else return a + 1;
        }, null);

        if (errors !== 0) {
            this.setState({
                error: {
                    ...this.state.error,
                    overall: '모든 항목을 기입하셨나요?',
                },
            });
        } else if (
            this.state.IDokay &&
            errors === 0 &&
            values === 0 &&
            this.state.buttonForm.checkA
        ) {
            this.props.updateTry(updateInfo);
        } else {
            this.setState({
                error: {
                    ...this.state.error,
                    overall: '모든 항목을 기입하셨나요?',
                },
            });
        }
    };

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        const validation = this.validate[name];
        if (validation !== undefined) validation(value);

        this.setState({
            [name]: value,
            errors: {
                ...this.state.errors,
                overall: null,
            },
        });
    };

    render() {
        return !this.props.logged ? (
            <Redirect to="/login" />
        ) : (
            <div className="h-screen flex flex-row justify-between">
                <div className="w-49% h-auto flex flex-col justify-between">
                    <ListedItems title="모임 예약 내역" />
                    <div className="h-25% border border-green-500"></div>
                    <ListedItems title="장터 주문 내역" />
                </div>

                <div className="w-49% h-80% p-4 flex flex-col justify-between border border-green-500">
                    <div className="font-bold text-2xl text-green-500">나의 정보</div>
                    <form className="flex flex-col justify-between">
                        <InputWithLabel
                            label="아이디"
                            type="text"
                            name="userID"
                            value={this.state.userID}
                            onChange={this.handleChange}
                            placeholder="아이디"
                            error={this.state.error.userID}
                        />
                        <InputWithLabel
                            label="E-MAIL"
                            type="email"
                            name="email"
                            onChange={this.handleChange}
                            value={this.state.email}
                            placeholder="이메일"
                            error={this.state.error.email}
                        />
                        <InputWithLabel
                            label="이름"
                            type="text"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.name}
                            placeholder="이름"
                            error={this.state.error.name}
                        />
                        <InputWithLabel
                            label="비밀번호"
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                            value={this.state.password}
                            placeholder="비밀번호"
                            error={this.state.error.password}
                        />
                        <InputWithLabel
                            label="비밀번호 확인"
                            type="password"
                            name="passwordConfirm"
                            onChange={this.handleChange}
                            value={this.state.passwordConfirm}
                            placeholder="비밀번호 확인"
                            error={this.state.error.passwordConfirm}
                        />
                        <InputWithLabel
                            label="우편번호"
                            type="text"
                            name="zipCode"
                            onChange={this.handleChange}
                            value={this.state.zipCode}
                            placeholder="우편번호"
                            additionalButton={true}
                            additionalLabel="검색"
                            additionalOnClick={this.openAddressAPI}
                            value={this.state.address.zipCode}
                            disabled="disabled"
                        />
                        <InputWithLabel
                            label="주소"
                            type="text"
                            name="addressA"
                            onChange={this.handleChange}
                            value={this.state.addressA}
                            placeholder=""
                            value={this.state.address.addressA}
                            disabled="disabled"
                        />
                        <InputWithLabel
                            label=""
                            type="text"
                            name="addressB"
                            onChange={this.handleChange}
                            value={this.state.addressB}
                            placeholder="상세 주소"
                        />

                        <InputWithLabel
                            label="연락처"
                            type="text"
                            name="phone"
                            onChange={this.handleChange}
                            placeholder=""
                            error={this.state.error.phone}
                        />

                        <InputWithLabel
                            label="생년월일"
                            type="text"
                            name="birth"
                            onChange={this.handleChange}
                            placeholder=""
                            error={this.state.error.birth}
                        />
                    </form>
                    <div className="w-full flex flex-row justify-between">
                        <button className="w-49% h-16 border border-green-500 text-xl text-green-500">
                            회원 탈퇴
                        </button>
                        <button className="w-49% h-16 bg-green-500 text-xl text-white">
                            수정하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cookie: state.cookie,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(MyPage);
