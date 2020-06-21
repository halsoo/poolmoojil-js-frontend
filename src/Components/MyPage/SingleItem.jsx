import React from 'react';
import { Link } from 'react-router-dom';

export default function SingleItem(props) {
    return (
        <div className="w-full h-auto mb-2 p-4 border border-green-500">
            <div className="w-full flex flex-row justify-between">
                <div className="font-bold text-2xl text-green-500">{props.title}</div>
                {/* <Link to={props.goto} className="self-end font-bold text-lg text-green-500">
                    더보기
                </Link> */}
            </div>

            <div className="mt-8 w-full flex flex-col justify-between text-xl text-green-500">
                <div className="mb-4 w-full grid grid-cols-12">
                    <div className="col-start-1 col-end-3">구독 상태</div>
                    <div className="col-start-5 col-end-12">{props.item.subscStatus}</div>
                </div>
                <div className="mb-4 w-full grid grid-cols-12">
                    <div className="col-start-1 col-end-3">구독 일자</div>
                    <div className="col-start-5 col-end-12">
                        {props.item.createdAt.substring(0, 10)}
                    </div>
                </div>
                <div className="w-full grid grid-cols-12">
                    <div className="col-start-1 col-end-3">구독 기간</div>
                    <div className="col-start-5 col-end-12">3개월</div>
                </div>
            </div>
        </div>
    );
}
