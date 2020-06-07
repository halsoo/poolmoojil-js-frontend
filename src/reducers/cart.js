const cartReducer = (state = {}, action) => {
    switch (action.type) {
        case 'CART_IN': {
            return {
                ...state,
                [action.id]: {
                    category: action.category,
                    quantity: action.quantity,
                },
            };
        }

        case 'CART_OUT': {
            let nState = state;
            delete nState[action.id];
            return {
                ...nState,
            };
        }

        case 'CART_CLEAR': {
            return {};
        }

        case 'CART_COOKIE': {
            return { ...action.cart };
        }

        default:
            return state;
    }
};

export default cartReducer;
