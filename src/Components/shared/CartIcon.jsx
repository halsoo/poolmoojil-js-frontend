import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import cartImg from '../../img/cart.png';

class CartIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return this.props.logged.status && Object.keys(this.props.cart).length !== 0 ? (
            <div className="absolute w-5% top-1/4 right-8">
                <Link to="/cart">
                    <img className="w-full" src={cartImg} alt="" />
                </Link>
            </div>
        ) : null;
    }
}

const MapStateToProps = (state) => ({
    logged: state.logged,
    cart: state.cart,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(CartIcon);
