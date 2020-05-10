import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signupTry } from '../../actions';

import { isEmail, isLength, isAlphanumeric, isNumeric } from 'validator';
import InputWithLabel from './InputWithLabel';
import ButtonForm from './ButtonForm';
import { checkDuplicateAPI } from '../../util/api';
import mainLogo from '../../img/main_logo.png';
import key from './key';

class Signup extends Component {
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
            },

            IDokay: false,

            buttonForm: {
                checkA: false,
                checkB: false,
            },
        };
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
            result = strA + ' - ' + strB + ' - ' + strC;
        } else {
            if (strB.length() < 2) strB = '0' + strB;
            if (strC.length() < 2) strC = '0' + strC;
            result = strA + '-' + strB + '-' + strC;
        }

        return result;
    };

    checkDuplicate = async (event) => {
        const res = await checkDuplicateAPI(this.state.userID);
        if (res.status === 200 && !this.state.error.userID) {
            this.setState({ IDokay: true });
        } else {
            this.setState({
                error: {
                    ...this.state.error,
                    userID: '이미 존재하는 아이디입니다.',
                },
            });
        }
    };

    signup = async (event) => {
        const userID = this.state.userID ? this.state.userID : null;
        const name = this.state.name ? this.state.name : null;
        const email = this.state.email ? this.state.email : null;
        const password = this.state.password ? this.state.password : null;
        const phone =
            this.state.phoneA && this.state.phoneB && this.state.phoneC
                ? this.combine(this.state.phoneA, this.state.phoneB, this.state.phoneC, true)
                : null;
        const birth =
            this.state.birthA && this.state.birthB && this.state.birthC
                ? this.combine(this.state.birthA, this.state.birthB, this.state.birthC, false)
                : null;
        const zipCode = this.state.zipCode ? this.state.zipCode : null;
        const addressA = this.state.addressA ? this.state.addressA : null;
        const addressB = this.state.addressB ? this.state.addressB : null;

        const signupInfo = {
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
        const infos = Object.values(signupInfo).reduce((a, b) => a + b, 0);

        if (this.state.IDokay && errors === 0 && infos !== 0 && this.state.buttonForm.checkA) {
            this.props.signupTry(signupInfo, this.props.cookie);
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
            IDokay: false,
            [name]: value,
        });
    };

    handleCheck = (event) => {
        const target = event.target;
        const name = target.name;
        const value = !this.state.buttonForm[name];

        this.setState({
            buttonForm: {
                [name]: value,
            },
        });
    };

    popup = () => {
        // 호출된 페이지(jusopopup.jsp)에서 실제 주소검색URL(http://www.juso.go.kr/addrlink/addrLinkUrl.do)를 호출하게 됩니다.
        var pop = window.open(
            `http://www.juso.go.kr/addrlink/addrLinkUrl.do?confmKey=${key}&returnUrl=${window.location.href}`,
            'pop',
            'width=570,height=420, scrollbars=yes, resizable=yes',
        );

        // 모바일 웹인 경우, 호출된 페이지(jusopopup.jsp)에서 실제 주소검색URL(http://www.juso.go.kr/addrlink/addrMobileLinkUrl.do)를 호출하게 됩니다.
        //var pop = window.open("/popup/jusoPopup.jsp","pop","scrollbars=yes, resizable=yes");
    };

    static getDerivedStateFromProps(nProps, pState) {
        if (nProps.logged.error) {
            return {
                error: {
                    ...pState.error,
                    overall: '필수 항목에 값을 입력해주세요.',
                },
            };
        }
        return null;
    }

    render() {
        return this.props.logged.status ? (
            <Redirect to="/" />
        ) : (
            <div className="w-full h-auto relative p-12 border border-green-500">
                <div className="flex flex-col justify-between">
                    <div
                        className={`w-50% h-auto sm:mb-${this.state.error.overall ? 3 : 10} lg:mb-${
                            this.state.error.overall ? 3 : 10
                        } sm:text-7xl lg:text-4xl text-green-500`}
                    >
                        회원가입
                    </div>
                    <div className="w-50% h-auto sm:mb-6 lg:mb-6 sm:text-xl lg:text-xl text-red-500">
                        {this.state.error.overall ? this.state.error.overall : null}
                    </div>
                </div>

                <form id="login" className="w-60% h-auto flex flex-col justify-between">
                    <InputWithLabel
                        label="아이디"
                        type="text"
                        name="userID"
                        value={this.state.userID}
                        onChange={this.handleChange}
                        placeholder="아이디"
                        additionalButton={true}
                        additionalLabel="중복 확인"
                        additionalOnClick={this.checkDuplicate}
                        error={this.state.error.userID}
                        okay={this.state.IDokay}
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
                        additionalOnClick={this.popup}
                        value={this.state.address.zipCode}
                        disabled="disables"
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
                        placeholder=""
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

                <ButtonForm
                    checkOnChange={this.handleCheck}
                    onClick={this.signup}
                    checkAContents={
                        <p>
                            <Link className="text-purple-500" to="/terms">
                                이용약관
                            </Link>
                            과{' '}
                            <Link className="text-purple-500" to="/privacy">
                                개인정보 수집 및 이용
                            </Link>
                            에 동의
                        </p>
                    }
                    checkBContents={<p>풀무질 뉴스레터 수신 동의</p>}
                />

                <img className="absolute right-0 top-0 h-60%" src={mainLogo} alt="main logo" />
            </div>
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cookie: state.cookie,
});

const MapDispatchToProps = { signupTry };

export default connect(MapStateToProps, MapDispatchToProps)(Signup);