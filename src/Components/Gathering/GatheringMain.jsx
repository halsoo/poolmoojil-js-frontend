import React, { Component } from 'react';

import axios from 'axios';

export default class GatheringMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gatherings: [],
        };

        this.loadBooks();
    }

    loadBooks = async () => {
        const gatherings = await axios.get('http://localhost:4000/api/gatherings');
        const status = gatherings.status;
        if (status === 200) {
            this.setState({
                gatherings: gatherings.data.map((gathering) => {
                    return {
                        title: gathering.title,
                        date: gathering.date,
                        speaker: gathering.speaker,
                    };
                }),
            });
        } else {
            console.log(status);
        }
    };

    render() {
        const gatherings = this.state.gatherings;
        return (
            <div>
                <h1>Gatherings</h1>
                {gatherings.map((gathering, index) => {
                    return (
                        <div key={index}>
                            <h4>{gathering.title}</h4>
                            <h5>
                                {gathering.date}, {gathering.speaker}
                            </h5>
                        </div>
                    );
                })}
            </div>
        );
    }
}
