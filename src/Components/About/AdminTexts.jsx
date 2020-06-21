import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getAboutTexts, deleteText } from '../../util/api';

export default class AdminPlaces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            texts: undefined,
        };

        this.loadTexts();
    }

    loadTexts = async () => {
        const texts = await getAboutTexts();
        if (texts.status === 200) {
            this.setState({
                texts: texts.data,
            });
        }
    };

    delete = async (id) => {
        const res = await deleteText(id);

        if (res.status === 204) {
            const texts = await getAboutTexts();
            if (texts.status === 200) {
                this.setState({
                    texts: texts.data,
                });
            }
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.texts !== nState.texts) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.texts ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">소개글 편집하기</p>
                    <Link to="/about/texts/add" className="text-2xl">
                        + 추가
                    </Link>
                </div>

                {this.state.texts.map((text, index) => {
                    return (
                        <div
                            className={`${
                                index === this.state.texts.length - 1 ? null : 'mb-4'
                            } w-full h-auto p-8 flex flex-row justify-between text-green-500 border border-green-500`}
                        >
                            <div className="text-3xl">{text.title}</div>
                            <div className="w-20% flex flex-row justify-between">
                                <Link
                                    to={'/about/texts/edit/' + text.id}
                                    className="text-2xl self-center"
                                >
                                    수정
                                </Link>
                                <button className="text-2xl" onClick={() => this.delete(text.id)}>
                                    삭제
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-xl text-green-500">loading</div>
        );
    }
}
