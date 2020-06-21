import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getPlaces, deletePlace } from '../../util/api';

export default class AdminPlaces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            places: undefined,
        };

        this.loadPlaces();
    }

    loadPlaces = async () => {
        const places = await getPlaces();
        if (places.status === 200) {
            this.setState({
                places: places.data,
            });
        }
    };

    delete = async (id) => {
        const res = await deletePlace(id);

        if (res.status === 204) {
            const places = await getPlaces();
            if (places.status === 200) {
                this.setState({
                    places: places.data,
                });
            }
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.places !== nState.places) {
            return true;
        }

        return true;
    }

    render() {
        return this.state.places ? (
            <div className="w-full h-auto p-4 flex flex-col">
                <div className="mb-8 w-full h-auto flex flex-row justify-between text-green-500">
                    <p className="text-3xl">장소 편집하기</p>
                    <Link to="/about/places/add" className="text-2xl">
                        + 추가
                    </Link>
                </div>

                {this.state.places.map((place, index) => {
                    return (
                        <div
                            className={`${
                                index === this.state.places.length - 1 ? null : 'mb-4'
                            } w-full h-auto p-8 flex flex-row justify-between text-green-500 border border-green-500`}
                        >
                            <div className="text-3xl">{place.name}</div>
                            <div className="w-20% flex flex-row justify-between">
                                <Link
                                    to={'/about/places/edit/' + place.id}
                                    className="text-2xl self-center"
                                >
                                    수정
                                </Link>
                                <button className="text-2xl" onClick={() => this.delete(place.id)}>
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
