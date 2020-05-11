import React, { Component } from 'react';

import logo from '../../img/logo.png';
import left from '../../img/leftArrow.png';
import right from '../../img/rightArrow.png';
import { getAddressAPI } from '../../util/api';

class AddressSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queryText: '안새내길',
            currentPage: 1,
            addresses: [],
            isSearched: false,
            error: null,
        };
    }

    setInputText = (event) => {
        this.setState({
            queryText: event.target.value,
        });
    };

    findAddress = async (query, page) => {
        this.setState({
            isSearched: true,
        });
        const res = await getAddressAPI(query, page);
        //console.log(res);
        if (res.status === 200 && res.data.results.common.errorMessage === '정상') {
            const juso = res.data.results.juso;
            const total = res.data.results.common.totalCount;
            this.pushAddrs(juso);
            this.setState({
                total: total,
            });
        } else if (res.data.results.common.errorMessage) {
            this.setState({
                error: res.data.results.common.errorMessage,
            });
        }
    };

    pushAddrs = (juso) => {
        let tempAddr = [];
        juso.map((addr) => {
            return tempAddr.push({
                zipCode: addr.zipNo,
                addressA: addr.roadAddrPart1,
                oldAddress: addr.jibunAddr,
            });
        });

        this.setState({
            addresses: tempAddr,
        });
    };

    shouldComponentUpdate(nProps, nState) {
        if (nState.currentPage !== this.state.currentPage) {
            this.findAddress(this.state.queryText, nState.currentPage);
        }

        return true;
    }

    render() {
        return (
            <div className="h-full p-10 flex flex-col justify-between">
                <div className="h-20% flex flex-col justify-around">
                    <div className="w-full flex flex-row justify-center">
                        <input
                            className="w-70% mr-6 border border-green-500 text-6xl"
                            placeholder="도로명 주소, 건물명 또는 지번 입력"
                            value={this.state.queryText}
                            onChange={this.setInputText}
                        />

                        <button
                            className="w-15% bg-green-500 text-5xl text-white"
                            onClick={() => {
                                this.setState({
                                    currentPage: 1,
                                });
                                this.findAddress(this.state.queryText, this.state.currentPage);
                            }}
                        >
                            검색
                        </button>
                    </div>

                    <div className="flex ml-7% justify-start text-4xl text-green-500">
                        검색어 예 : 도로명(반포대로 58), 건물명(독립기념관), 지번(삼성동25)
                    </div>
                </div>

                {this.state.isSearched ? (
                    <div className="h-65% flex flex-col justify-around">
                        <div className="flex justify-start text-4xl text-green-500">
                            도로명주소 검색 결과({this.state.total})
                        </div>

                        <AddrList list={this.state.addresses} parent={window.opener} />

                        <div className="mx-auto w-40% flex flex-row justify-around">
                            <button
                                onClick={() => {
                                    this.setState({
                                        currentPage:
                                            this.state.currentPage > 1
                                                ? this.state.currentPage - 1
                                                : this.state.currentPage,
                                    });
                                }}
                            >
                                <img className="mx-auto w-2/12 h-auto" src={left} alt="left" />
                            </button>

                            <div>{this.state.currentPage}</div>

                            <button
                                onClick={() => {
                                    this.setState({
                                        currentPage:
                                            this.state.currentPage < this.state.total / 5
                                                ? this.state.currentPage + 1
                                                : this.state.currentPage,
                                    });
                                }}
                            >
                                <img className="mx-auto w-2/12 h-auto" src={right} alt="left" />
                            </button>
                        </div>
                    </div>
                ) : null}

                <div className="h-10% flex justify-center">
                    <img className="w-auto h-full" src={logo} alt="logo" />
                </div>
            </div>
        );
    }
}

export default AddressSearch;

class AddrList extends Component {
    constructor(props) {
        super(props);
    }

    sendMessage = (addressInfo) => {
        this.props.parent.postMessage(addressInfo, '*');
        this.props.parent.close();
    };

    render() {
        return (
            <table className="border-t border-b border-green-500">
                <tbody>
                    <tr className="h-16 text-green-500 border-b border-green-500">
                        <th className="pl-12 text-left font-normal">도로명주소</th>
                        <th className="font-normal">우편번호</th>
                    </tr>
                    {this.props.list.map((d, i) => (
                        <tr className="text-green-500 border-b border-green-500" key={i}>
                            <th className="pl-12 text-left font-normal">
                                <button onClick={() => this.sendMessage(d)}>
                                    <div className="text-5xl">{d.addressA}</div>
                                    <div className="text-lg">{d.oldAddress}</div>
                                </button>
                            </th>
                            <th className="font-normal">{d.zipCode}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
