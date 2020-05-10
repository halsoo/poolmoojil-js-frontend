import React from 'react';

export default function ButtonForm(props) {
    return (
        <div className="w-35% h-auto mb-16 absolute right-0 bottom-0">
            <div className="mb-4 text-lg text-green-500">
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
                className="w-90% h-20 bg-green-500 text-3xl text-white"
                type="button"
                onClick={props.onClick}
            >
                회원가입
            </button>
        </div>
    );
}
