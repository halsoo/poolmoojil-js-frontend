import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class AdminAboutIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="w-full h-auto flex flex-col justify-center">
                <Link to="about/places" className="w-30% h-32 mt-32 mx-auto">
                    <button className="w-full h-full text-3xl text-white bg-green-500 border border-green-500">
                        장소 편집하기
                    </button>
                </Link>
                <Link to="about/texts" className="w-30% h-32 my-32 mx-auto">
                    <button className="w-full h-full text-3xl text-white bg-green-500 border border-green-500">
                        소개글 편집하기
                    </button>
                </Link>
            </div>
        );
    }
}
