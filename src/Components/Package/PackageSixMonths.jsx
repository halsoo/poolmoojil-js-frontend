import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getPackageByID } from '../../util/api';

import PackageSubsc from './PackageSubsc';

class PackageSixMonths extends Component {
    constructor(props) {
        super(props);
        this.state = {
            package: undefined,
        };

        this.getInfo();
    }

    getInfo = async () => {
        const res = await getPackageByID(this.props.match.params.id);
        if (res.status === 200) {
            this.setState({
                package: res.data,
            });
        }
    };

    render() {
        const singlePackage = this.state.package;
        return singlePackage ? (
            <div className="flex flex-row">
                <PackageSubsc isOnce={false} package={singlePackage} />
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(PackageSixMonths);
