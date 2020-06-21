import React from 'react';

export default function ButtonForm(props) {
    return (
        <div className="lg:w-35% sm:w-full h-auto lg:mb-16 lg:absolute lg:right-0 lg:bottom-0">
            <div className="lg:mb-4 sm:mb-12 lg:text-lg sm:text-4xl text-green-500">
                <div className="flex flex-row items-center">
                    <input
                        className="mr-4"
                        name="checkA"
                        type="checkbox"
                        onChange={props.checkOnChange}
                    />
                    <label> {props.checkAContents} </label>
                </div>
                <div className="flex flex-row items-center">
                    <input
                        className="mr-4"
                        name="checkB"
                        type="checkbox"
                        onChange={props.checkOnChange}
                    />
                    <label> {props.checkBContents} </label>
                </div>
            </div>

            <button
                className="lg:w-90% sm:w-full lg:h-20 sm:h-48 bg-green-500 lg:text-3xl sm:text-5xl text-white"
                type="button"
                onClick={props.onClick}
            >
                회원가입
            </button>
        </div>
    );
}
