import React from 'react';

export default function ReturnAndRefundPolicy(props) {
    return (
        <div className="mt-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="text-2xl mb-10">배송/교환/반품 안내</div>
            <div className="mb-4">
                <p className="mb-2 lg:text-2xl sm:text-6xl">반품/교환 사유에 따른 요청 가능 기간</p>
                <p className="lg:text-xl sm:text-5xl">
                    1. 구매자 단순 변심은 상품 수령 후 7일 이내
                </p>
                <p className="lg:text-xl sm:text-5xl">
                    2. 표시/광고와 상이, 상품 하자의 경우 상품 수령 후 3개월 이내 혹은 표시/광고와
                    다른 사실을 안 날로부터 30일 이내. 둘 중 하나 경과 시 반품/교환 불가
                </p>
            </div>
            <div className="">
                <p className="mb-2 lg:text-2xl sm:text-6xl">반품/교환 불가능 사유</p>
                <p className="lg:text-xl sm:text-5xl">1. 반품 요청 기간이 지난 경우</p>
                <p className="lg:text-xl sm:text-5xl">
                    2. 구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우 (단, 상품의 내용을
                    확인하기 위하여 포장 등을 훼손한 경우는 제외)
                </p>
                <p className="lg:text-xl sm:text-5xl">
                    3. 구매자의 책임 있는 사유로 포장이 훼손되어 상품 가치가 현저히 상실된 경우
                </p>
                <p className="lg:text-xl sm:text-5xl">
                    4. 구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우
                </p>
                <p className="lg:text-xl sm:text-5xl">
                    5. 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한
                    경우
                </p>
                <p className="lg:text-xl sm:text-5xl">
                    6. 고객의 요청사항에 맞춰 제작에 들어가는 맞춤제작상품의 경우
                </p>
                <p className="lg:text-xl sm:text-5xl">
                    7. 복제 가능한 상품 등의 포장을 훼손한 경우
                </p>
            </div>
        </div>
    );
}
