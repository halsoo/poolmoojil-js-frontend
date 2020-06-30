import React from 'react';
import { Link } from 'react-router-dom';

import { oneTimeDateStr } from '../../util/localeStrings';

export default function ListedItems(props) {
    let count = 0;
    return (
        <div className="h-auto mb-2 p-4 border border-green-500">
            <div className="w-full flex flex-row justify-between">
                <div className="font-bold text-2xl text-green-500"> {props.title} </div>
                <Link to={props.goto} className="self-end font-bold text-lg text-green-500">
                    더보기
                </Link>
            </div>

            <div className="mt-6 flex flex-col text-green-500">
                {props.items[0]
                    ? props.items[0].cart
                        ? props.items.map((order, index) => {
                              if (index < 2) {
                                  const mainImg = order.books[0]
                                      ? order.books[0].mainImg.link
                                      : order.goods[0].mainImg.link;
                                  return (
                                      <div
                                          className="mb-6 py-2 w-full flex flex-row justify-between border-b border-green-500"
                                          key={index}
                                      >
                                          <img className="w-20%" src={mainImg} alt="" />
                                          <Link
                                              to={'/mypage/order-history/' + order.orderNum}
                                              className="self-center"
                                          >
                                              <p>{order.orderNum}</p>
                                          </Link>
                                          <p className="self-center">
                                              {oneTimeDateStr(order.createdAt.substring(0, 10))}
                                          </p>
                                      </div>
                                  );
                              }
                          })
                        : props.items.map((item, index) => {
                              if (count < 3) {
                                  const singleItem = item.gathering ? item.gathering : item.package;
                                  if (item.isSubsc === undefined || item.isSubsc === false) {
                                      count++;
                                      return (
                                          <div
                                              className="mb-6 py-2 w-full flex flex-row justify-between border-b border-green-500"
                                              key={index}
                                          >
                                              {singleItem ? (
                                                  <img
                                                      className="w-20%"
                                                      src={singleItem.mainImg.link}
                                                      alt=""
                                                  />
                                              ) : null}
                                              <p className="self-center">
                                                  {singleItem ? singleItem.title : null}
                                              </p>
                                              <p className="self-center">
                                                  {item.gathering
                                                      ? oneTimeDateStr(item.date)
                                                      : item.package
                                                      ? oneTimeDateStr(item.purchaseDate)
                                                      : null}
                                              </p>
                                          </div>
                                      );
                                  }
                              }
                          })
                    : null}
            </div>
        </div>
    );
}
