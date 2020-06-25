import React, { Component } from 'react';
import { getPlaces, getAboutTexts } from '../../util/api';

export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            places: [],
            texts: [],
        };

        this.getPlaces();
        this.getTexts();
    }

    getPlaces = async () => {
        const places = await getPlaces();
        if (places.status === 200) {
            this.setState({
                places: places.data,
            });
        }
    };

    getTexts = async () => {
        const texts = await getAboutTexts();
        if (texts.status === 200) {
            const splitBody = texts.data.map((text) => {
                return text.body.split(/\r\n|\r|\n/);
            });

            texts.data.forEach((text, index) => {
                text.body = splitBody[index];
            });

            this.setState({
                texts: texts.data,
            });
        }
    };

    shouldComponentUpdate(nProps, nState) {
        if (this.state.places !== nState.places || this.state.texts !== nState.texts) {
            return true;
        }
        return true;
    }

    render() {
        return this.state.places && this.state.texts ? (
            <div>
                {this.state.texts.map((text) => {
                    return <TextBox key={text.id} text={text} />;
                })}

                {this.state.places.map((place) => {
                    return <PlaceInfo key={place.id} place={place} />;
                })}
            </div>
        ) : (
            <div className="lg:text-xl sm:text-5xl text-green-500">loading</div>
        );
    }
}

function PlaceInfo(props) {
    return (
        <div
            className="my-2 
                        lg:h-plg sm:h-auto w-auto
                        flex flex-row sm:justify-between
                        border border-green-500"
        >
            {props.place.mainImg ? (
                <img
                    src={props.place.mainImg.link}
                    className="sm:hidden
                            h-auto w-1/2
                            lg:my-4 lg:ml-4
                            lg:col-start-1 col-end-8"
                />
            ) : (
                <div
                    className="sm:hidden
                        h-auto w-1/2
                        lg:my-4 lg:ml-4
                        lg:col-start-1 col-end-8
                        bg-purple-500"
                />
            )}

            <div
                className="lg:py-4 lg:pl-4 
                            sm:py-4 sm:pl-8 sm:w-full
                            text-green-500
                            flex flex-col justify-around"
            >
                <div className="lg:text-2xl sm:text-6xl mb-4 font-bold">{props.place.name}</div>
                <div className="lg:text-lg sm:text-5xl">
                    {props.place.address ? <p> {props.place.address} </p> : null}
                    {props.place.subAddress ? <p> {props.place.subAddress} </p> : null}
                </div>

                <div className="lg:text-base sm:text-5xl">
                    {props.place.weekday ? (
                        <DetailInfo
                            title={props.place.weekday}
                            contents={`
                            ${props.place.weekdayOpen.slice(0, 5)} 
                            - ${props.place.weekdayClose.slice(0, 5)}`}
                        />
                    ) : null}
                    {props.place.shortday ? (
                        <DetailInfo
                            title={props.place.shortday}
                            contents={`
                            ${props.place.shortdayOpen.slice(0, 5)} 
                            - ${props.place.shortdayClose.slice(0, 5)}`}
                        />
                    ) : null}
                    {props.place.closing ? (
                        <DetailInfo title={props.place.closing} contents="휴무" />
                    ) : null}
                </div>

                <div className="lg:text-base sm:text-5xl">
                    {props.place.phone ? (
                        <DetailInfo title="전화" contents={props.place.phone} />
                    ) : null}
                    {props.place.fax ? (
                        <DetailInfo title="팩스" contents={props.place.fax} />
                    ) : null}
                </div>

                <div className="lg:text-base sm:text-5xl">
                    {props.place.insta ? (
                        <DetailInfo title="인스타" contents={props.place.insta} />
                    ) : null}
                    {props.place.email ? (
                        <DetailInfo title="이메일" contents={props.place.email} />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function TextBox(props) {
    return (
        <div
            className="my-2
                        lg:p-3 sm:p-8
                        flex flex-col justify-between
                        border border-green-500
                        text-green-500"
        >
            <h1 className="mb-6 lg:text-2xl sm:text-6xl font-bold">{props.text.title}</h1>

            {props.text.body.map((text, index) => {
                return <Paragraph key={index} contents={text} />;
            })}

            {props.text.emphasis ? (
                <p className="mb-6 text-center lg:text-lg sm:text-5xl font-bold">
                    {props.text.emphasis}
                </p>
            ) : null}

            <h3 className="text-right sm:text-5xl">{props.text.date}</h3>
            <h3 className="text-right sm:text-5xl">{props.text.writer}</h3>
        </div>
    );
}

function Paragraph(props) {
    return <div className="mb-6 lg:text-lg sm:text-5xl"> {props.contents} </div>;
}

function DetailInfo(props) {
    return (
        <div>
            <span className="lg:text-lg sm:text-5xl mr-4">{props.title}</span>
            <span>{props.contents}</span>
        </div>
    );
}
