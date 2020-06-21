import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { isLength, isAscii, isNumeric } from 'validator';
import InputWithLabel from './InputWithLabel';
import ListedItems from './ListedItems';
import SingleItem from './SingleItem';
import AddressSearch from '../shared/AddressSearch';
import NewWindow from 'react-new-window';
import { getUserCookie, updateAPI } from '../../util/api';

class MyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: undefined,
            error: {
                overall: null,
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

            updateOKAY: false,
            popup: false,
        };

        this.getUser();
    }

    getUser = async () => {
        const res = await getUserCookie();
        if (res.status === 200) {
            const user = res.data;
            this.setState({
                user: res.data,
                userID: user.userID,
                email: user.email,
                name: user.name,
                address: {
                    zipCode: user.address[0].zip,
                    addressA: user.address[0].addressA,
                    addressB: user.address[0].addressB,
                },
                newsLetter: user.newsLetter === null ? false : user.newsLetter,
                phoneA: user.phone.substring(0, 3),
                phoneB: user.phone.substring(3, 7),
                phoneC: user.phone.substring(7, 11),
                birthA: user.birth.substring(0, 4),
                birthB: user.birth.substring(5, 7),
                birthC: user.birth.substring(8, 10),
            });
        }
    };

    validate = {
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
        const password = this.state.password;
        const phone = this.combine(this.state.phoneA, this.state.phoneB, this.state.phoneC, true);
        const birth = this.combine(this.state.birthA, this.state.birthB, this.state.birthC, false);
        const zipCode = this.state.address.zipCode;
        const addressA = this.state.address.addressA;
        const addressB = this.state.address.addressB;
        const newsLetter = this.state.newsLetter;

        const updateInfo = {
            password,
            phone,
            birth,
            zipCode,
            addressA,
            addressB,
            newsLetter,
        };

        const errors = Object.values(this.state.error).reduce((a, b) => a + b, 0);

        if (errors !== 0) {
            this.setState({
                error: {
                    ...this.state.error,
                    overall: '모든 항목을 기입하셨나요?',
                },
            });
        } else if (errors === 0) {
            const res = await updateAPI(updateInfo);

            if (res.status === 201) {
                this.setState({
                    updateOKAY: true,
                });
            }
        }
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (name === 'newsLetter') {
            const value = !this.state[name];
            this.setState({
                newsLetter: value,
            });
        } else if (name === 'addressB') {
            const value = target.value;
            this.setState({
                address: {
                    ...this.state.address,
                    addressB: value,
                },
            });
        } else {
            const value = target.value;
            const validation = this.validate[name];
            if (validation !== undefined) validation(value);

            this.setState({
                [name]: value,
                errors: {
                    ...this.state.errors,
                    overall: null,
                },
            });
        }
    };

    handlePopUp = () => {
        this.setState({
            popup: true,
        });
    };

    componentDidMount() {
        window.addEventListener(
            'message',
            (event) => {
                if (event.data.zipCode) {
                    this.setState({
                        address: {
                            zipCode: event.data.zipCode,
                            addressA: event.data.addressA,
                        },
                    });
                }
            },
            false,
        );
    }

    shouldComponentUpdate(nProps, nState) {
        if (this.state.user !== nState.user) {
            return true;
        }

        if (this.state.updateOKAY === true) {
            this.setState({
                updateOKAY: false,
            });

            return true;
        }

        return true;
    }

    render() {
        return !this.props.logged ? (
            <Redirect to="/login" />
        ) : this.state.user ? (
            <div className="h-auto flex lg:flex-row sm:flex-col sm:flex-col-reverse justify-between">
                <div className="lg:w-49% sm:w-full h-auto flex flex-col justify-between">
                    <ListedItems
                        title="모임 예약 내역"
                        items={this.state.user.gatheringHistories}
                        goto={'/mypage/gathering-history'}
                    />
                    <SingleItem
                        title="꾸러미 구독"
                        item={
                            this.state.user.packageSubscs[this.state.user.packageSubscs.length - 1]
                        }
                    />
                    <ListedItems
                        title="꾸러미 구입 내역"
                        items={this.state.user.packageHistories}
                        goto={'/mypage/package-history'}
                    />
                    <ListedItems
                        title="장터 주문 내역"
                        items={this.state.user.orderHistories}
                        goto={'/mypage/order-history'}
                    />
                </div>

                <div className="lg:w-49% sm:w-full sm:mb-2 h-p3xl p-4 flex flex-col justify-between border border-green-500">
                    <div className="flex flex-row justify-between">
                        <div className="font-bold lg:text-2xl sm:text-5xl text-green-500">
                            나의 정보
                        </div>
                        <div className="flex flex-row items-center lg:text-lg sm:text-4xl text-green-500">
                            <input
                                className="mr-4"
                                name="newsLetter"
                                type="checkbox"
                                checked={this.state.newsLetter}
                                onChange={this.handleChange}
                            />
                            <label>풀무질 뉴스레터 수신 동의</label>
                        </div>
                    </div>
                    <form className="flex flex-col justify-between">
                        <InputWithLabel
                            label="아이디"
                            type="text"
                            name="userID"
                            value={this.state.userID}
                            onChange={this.handleChange}
                            placeholder="아이디"
                            error={this.state.error.userID}
                            disabled="disabled"
                        />
                        <InputWithLabel
                            label="E-MAIL"
                            type="email"
                            name="email"
                            onChange={this.handleChange}
                            value={this.state.email}
                            placeholder="이메일"
                            error={this.state.error.email}
                            disabled="disabled"
                        />
                        <InputWithLabel
                            label="이름"
                            type="text"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.name}
                            placeholder="이름"
                            error={this.state.error.name}
                            disabled="disabled"
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
                            additionalOnClick={this.handlePopUp}
                            value={this.state.address.zipCode}
                            disabled="disabled"
                        />
                        <InputWithLabel
                            label="주소"
                            type="text"
                            name="addressA"
                            onChange={this.handleChange}
                            value={this.state.address.addressA}
                            placeholder=""
                            disabled="disabled"
                        />
                        <InputWithLabel
                            label=""
                            type="text"
                            name="addressB"
                            onChange={this.handleChange}
                            value={this.state.address.addressB}
                            placeholder="상세 주소"
                        />

                        <InputWithLabel
                            label="연락처"
                            type="text"
                            name="phone"
                            onChange={this.handleChange}
                            placeholder=""
                            valueA={this.state.phoneA}
                            valueB={this.state.phoneB}
                            valueC={this.state.phoneC}
                            error={this.state.error.phone}
                        />

                        <InputWithLabel
                            label="생년월일"
                            type="text"
                            name="birth"
                            onChange={this.handleChange}
                            placeholder=""
                            valueA={this.state.birthA}
                            valueB={this.state.birthB}
                            valueC={this.state.birthC}
                            error={this.state.error.birth}
                        />
                    </form>

                    {this.state.popup ? (
                        <NewWindow
                            name="popup"
                            center="screen"
                            onUnload={() => this.setState({ popup: false })}
                            features={{ width: 570, height: 450 }}
                        >
                            <AddressSearch />
                        </NewWindow>
                    ) : null}

                    <div className="w-full flex flex-row justify-between">
                        <button className="w-49% h-16 border border-green-500 lg:text-xl sm:text-4xl text-green-500">
                            회원 탈퇴
                        </button>
                        <button
                            className="w-49% h-16 bg-green-500 lg:text-xl sm:text-4xl text-white"
                            onClick={this.update}
                        >
                            수정하기
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="lg:text-xl sm:text-5xl text-green-500">loading</div>
        );
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cookie: state.cookie,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(MyPage);
