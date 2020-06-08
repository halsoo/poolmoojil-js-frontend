import React from 'react';

export default function ReturnAndRefundPolicy(props) {
    return (
        <div className="mt-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="text-2xl mb-10">배송/교환/반품 안내</div>
            <p className="lg:text-xl sm:text-4xl">
                배송시작 전까지 100% 환불이며, 받은 후 반품 환불 불가
            </p>
        </div>
    );
}
