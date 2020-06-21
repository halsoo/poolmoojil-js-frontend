import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    createOrderHistory,
    createPackageHistory,
    createPackageSubsc,
    createGatheringHistory,
} from '../../util/api';

import { orderIn, packageHistoryIn, packageSubscIn, gatheringHistoryIn } from '../../actions';

class ButtonOne extends Component {
    constructor(props) {
        super(props);
    }

    onClickPayment = () => {
        /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        IMP.init('imp04344123');

        /* 2. 결제 데이터 정의하기 */
        const data = {
            pg: this.props.pg, // PG사
            pay_method: 'card', // 결제수단
            merchant_uid: `${this.props.user.userID}_${new Date().getTime()}`, // 주문번호
            amount:
                this.props.origin === 'store'
                    ? this.props.price + this.props.shippingFee - this.props.creditUse
                    : this.props.origin.includes('package')
                    ? this.props.price + this.props.shippingFee - this.props.creditUse
                    : this.props.price - this.props.creditUse, // 결제금액
            name: `poolmoojil_${this.props.origin}_${new Date().getTime()}`,
            buyer_name: this.props.user.name, // 구매자 이름
            buyer_tel: this.props.user.tel, // 구매자 전화번호
            notice_url: 'https://service.iamport.kr/kcp_payments/notice_vbank',
        };

        /* 4. 결제 창 호출하기 */
        if (
            this.props.shippingFee !== 0 ||
            (this.props.origin === 'package_sixtime' && this.props.shippingFee === 0) ||
            (this.props.origin.includes('gathering') && !this.props.shippingFee)
        ) {
            IMP.request_pay(data, this.callback);
        }
    };

    /* 3. 콜백 함수 정의하기 */
    callback = async (response) => {
        const { success, merchant_uid, error_msg } = response;
        const props = this.props;
        const orderHistory = {
            user: props.user,
            orderNum: merchant_uid,
            name: props.shipInfo ? props.shipInfo.name : undefined,
            zip: props.shipInfo ? props.shipInfo.zip : undefined,
            addressA: props.shipInfo ? props.shipInfo.addressA : undefined,
            addressB: props.shipInfo ? props.shipInfo.addressB : undefined,
            phone: props.shipInfo ? props.shipInfo.phone : undefined,
            cart: props.cart,
            gathering: props.gathering,
            headCount: props.headCount,
            package: props.package,
            transactionStatus: '준비중',
            creditUse: props.creditUse,
            shippingFee: props.shippingFee,
            totalPrice: props.price,
        };

        if (success) {
            let res = undefined;
            switch (props.origin) {
                case 'store':
                    res = await createOrderHistory(orderHistory);
                    break;
                case 'package_onetime':
                    res = await createPackageHistory(orderHistory);
                    break;
                case 'package_sixtime':
                    res = await createPackageSubsc(orderHistory);
                    break;
                case 'gathering_onetime':
                    res = await createGatheringHistory(orderHistory);
                    break;
                case 'gathering_oneyear':
                    //res = await createGatheringSubsc(orderHistory);
                    break;
                default:
                    break;
            }
            if (res.status === 200) {
                switch (props.origin) {
                    case 'store':
                        this.props.orderIn(res.data.orderNum);
                        this.props.history.push('/recent-order');
                        break;
                    case 'package_onetime':
                        this.props.packageHistoryIn(res.data.orderNum);
                        this.props.history.push('/recent-package-history');
                        break;
                    case 'package_sixtime':
                        this.props.packageSubscIn(res.data.orderNum);
                        this.props.history.push('/recent-package-subsc');
                        break;
                    case 'gathering_onetime':
                        this.props.gatheringHistoryIn(res.data.orderNum);
                        this.props.history.push('/recent-gathering-history');
                        break;
                    // case 'gathering_oneyear':
                    //     //this.props.gatheringSubscIn(res.data.id);
                    //     this.props.history.push('/recent-gathering-subsc');
                    //     break;
                    default:
                        break;
                }
            }
        } else {
            alert(`결제 실패: ${error_msg}`);
        }
    };

    render() {
        return (
            <div className="w-25% mx-auto">
                <button
                    className="w-full h-20 mx-auto text-2xl text-white bg-green-500"
                    onClick={this.onClickPayment}
                >
                    <Link>결제하기</Link>
                </button>
            </div>
        );
    }
}
const MapStateToProps = (state) => ({
    cart: state.cart,
    order: state.order,
});

const MapDispatchToProps = { orderIn, packageHistoryIn, packageSubscIn, gatheringHistoryIn };

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(ButtonOne));
