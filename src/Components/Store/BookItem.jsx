import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ReturnAndRefundPolicy from './ReturnAndRefundPolicy';

import { getBookByID } from '../../util/api';
import { priceStr, oneTimeDateStr } from '../../util/localeStrings';
import { cartInTry } from '../../actions';

class BookItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: undefined,
            quantity: 1,
        };

        this.getInfo();
    }

    getInfo = async () => {
        const res = await getBookByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState({
                book: res.data,
            });
        }
    };

    handleQuantity = (e) => {
        const target = e.target;
        const value = parseInt(target.value);

        this.setState({
            quantity: value,
        });
    };

    render() {
        const book = this.state.book;
        return book ? (
            <div className="flex flex-col">
                <div className="p-4 flex flex-row justify-between border border-green-500">
                    <div className="w-50% h-auto flex justify-center">
                        <div className="w-90% my-auto">
                            {book.mainImg ? (
                                <img
                                    className="w-full border border-green-500"
                                    src={book.mainImg.link}
                                    alt=""
                                />
                            ) : (
                                <div className="w-full border border-green-500 bg-purple-500" />
                            )}
                        </div>
                    </div>

                    <div className="w-50% h-auto p-4 flex flex-col">
                        <BookItemGeneralDesc
                            book={book}
                            value={this.state.quantity}
                            onChange={this.handleQuantity}
                        />
                        {!this.props.logged.status ? (
                            <ButtonLogin />
                        ) : book.quantity > 0 ? (
                            <ButtonGroup
                                cartOnClick={() =>
                                    this.props.cartInTry({
                                        id: book.id,
                                        category: 'book',
                                        quantity: this.state.quantity,
                                    })
                                }
                            />
                        ) : (
                            <OutOfStock />
                        )}
                    </div>
                </div>
                <BookItemInfo book={book} />
                <BookItemDetailDesc body={book.desc} />
                <BookAdditionalImages images={book.additionalImg} />
                <ReturnAndRefundPolicy />
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cart: state.cart,
});

const MapDispatchToProps = { cartInTry };

export default connect(MapStateToProps, MapDispatchToProps)(BookItem);

function BookItemGeneralDesc(props) {
    const book = props.book;

    const price = book.price ? priceStr(book.price) : null;

    return (
        <div className="w-full h-full p-4 flex flex-col text-green-500">
            <p className="text-3xl mb-4">{book.title}</p>
            <p className="text-xl mb-4">{book.author} 지음</p>
            <p className="text-xl mb-4">{book.translator} 옮김</p>
            <p className="text-xl mb-4">{book.publishingCompany}</p>
            <p className="text-3xl mb-4">{price}원</p>
            <p className="text-xl mb-4">
                배송비: 3,000원 (30,000원 이상 구매시 무료 / 제주 추가 3,000원, 제주 외 도서지역
                추가 4,000원)
            </p>

            <div className="flex flex-row">
                <label className="text-xl mr-16">수량</label>
                <input
                    className="w-20 pl-4 text-xl border border-green-500"
                    type="number"
                    value={props.value}
                    onChange={props.onChange}
                    min="1"
                    step="1"
                ></input>
            </div>
        </div>
    );
}

function ButtonLogin(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button className="w-full h-18 text-white text-2xl bg-green-500" name="needLogin">
                <Link to="/login">구입하려면 로그인</Link>
            </button>
        </div>
    );
}

function ButtonGroup(props) {
    return (
        <div className="mt-2 flex flex-col justify-between">
            <div className="mb-2 flex flex-row justify-between">
                <Link
                    className="w-49% h-18 flex justify-center text-2xl text-green-500 border border-green-500"
                    to="/cart"
                >
                    <button className="m-auto" onClick={props.cartOnClick}>
                        구매
                    </button>
                </Link>

                <button
                    className="w-49% h-18 text-2xl text-white bg-green-500"
                    name="oneTime"
                    onClick={props.cartOnClick}
                >
                    장바구니 추가
                </button>
            </div>
        </div>
    );
}

function OutOfStock(props) {
    return (
        <div className="mt-2 flex flex-row justify-between ">
            <button
                className="w-full lg:h-18 sm:h-32 text-2xl text-green-500 border border-green-500"
                name="Over"
            >
                품절
            </button>
        </div>
    );
}

function BookItemInfo(props) {
    const book = props.book;
    const publishDate = book.publishDate ? oneTimeDateStr(book.publishDate) : '';
    const pages = book.pages ? book.pages + '쪽' : '';
    const dimensions = book.dimensions ? book.dimensions + 'mm' : '';
    const weight = book.weight ? book.weight + 'g' : '';
    const ISBNnum = book.ISBN ? book.ISBN : '';
    return (
        <div className="mt-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="text-2xl mb-10">품목 정보</div>
            <InfoItem title="출간일" contents={publishDate} />
            <InfoItem title="쪽수" contents={pages} />
            <InfoItem title="크기" contents={dimensions} />
            <InfoItem title="무게" contents={weight} />
            <InfoItem title="ISBN-13" contents={ISBNnum} />
        </div>
    );
}

function InfoItem(props) {
    return (
        <div className="grid grid-cols-12 mb-2">
            <div className="col-start-1 col-end-2 text-xl">{props.title}</div>
            <div className="col-start-3 col-end-13 text-xl">{props.contents}</div>
        </div>
    );
}

function BookItemDetailDesc(props) {
    const body = props.body.split(/\r\n|\r|\n/);
    return (
        <div className="mt-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="text-2xl mb-10">도서 소개</div>
            {body.map((para, index) => {
                const mb = index === body.length - 1 ? false : true;
                return (
                    <p className={`${mb ? 'mb-6' : 'mb-0'} lg:text-xl sm:text-5xl`} key={index}>
                        {para}
                    </p>
                );
            })}
        </div>
    );
}

function BookAdditionalImages(props) {
    const images = props.images;
    return (
        <div className="mt-4 p-4 flex flex-col text-green-500 border border-green-500">
            <div className="text-2xl mb-10">상세 이미지</div>
            {images
                ? images.map((img, index) => {
                      const mb = index === images.length - 1 ? false : true;
                      return (
                          <img
                              className={`${mb ? 'mb-2' : 'mb-0'} w-full h-auto`}
                              key={index}
                              src={img.link}
                              alt=""
                          />
                      );
                  })
                : null}
        </div>
    );
}
