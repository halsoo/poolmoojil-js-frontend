import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getGatheringByID } from '../../util/api';

import GatheringSubsc from './GatheringSubsc';

class GatheringOneTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gathering: undefined,
        };

        this.getInfo();
    }

    getInfo = async () => {
        const res = await getGatheringByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState({
                gathering: res.data,
            });
        }
    };

    render() {
        const gathering = this.state.gathering;
        return gathering ? (
            <div className="flex flex-row">
                <GatheringSubsc
                    isAll={gathering.isAll}
                    isOnce={gathering.count ? false : true}
                    gathering={gathering}
                />
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(GatheringOneTime);
