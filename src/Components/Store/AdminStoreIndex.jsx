import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class AdminStoreIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="w-full h-auto flex flex-col justify-center">
                <Link to="store/book" className="w-30% h-32 mt-32 mx-auto">
                    <button className="w-full h-full text-3xl text-white bg-green-500 border border-green-500">
                        도서 관리
                    </button>
                </Link>
                <Link to="store/good" className="w-30% h-32 my-32 mx-auto">
                    <button className="w-full h-full text-3xl text-white bg-green-500 border border-green-500">
                        굿즈 관리
                    </button>
                </Link>
                <Link to="store/order" className="w-30% h-32 mb-32 mx-auto">
                    <button className="w-full h-full text-3xl text-white bg-green-500 border border-green-500">
                        주문 관리
                    </button>
                </Link>
            </div>
        );
    }
}
