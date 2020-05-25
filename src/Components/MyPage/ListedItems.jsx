import React from 'react';
import { Link } from 'react-router-dom';

export default function ListedItems(props) {
    return (
        <div className="h-36% p-4 border border-green-500">
            <div className="w-full flex flex-row justify-between">
                <div className="font-bold text-2xl text-green-500"> {props.title} </div>
                <Link to="./mypage/gathering" className="self-end font-bold text-lg text-green-500">
                    더보기
                </Link>
            </div>

            <div className="flex flex-col justify-around">
                {/* {props.items.map((item, index) => {
                    <SingleItem key={index} item={item} />;
                })} */}
            </div>
        </div>
    );
}

function SingleItem(props) {
    return (
        <div className="w-full h-30% p-2 border-b border-green-500">
            <div className="w-full flex flex-row justify-between">
                <div className="font-bold text-2xl text-green-500"> </div>
                <Link to="./mypage/gathering" className="self-end font-bold text-lg text-green-500">
                    더보기
                </Link>
            </div>

            <div>
                <div></div>
                <div></div>
            </div>

            <div></div>
        </div>
    );
}
