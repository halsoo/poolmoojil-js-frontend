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

        case 'CART_INCREASE': {
            return {
                ...state,
                [action.id]: state[action.id] + 1,
            };
        }

        case 'CART_DECREASE': {
            let nState = state[action.id];
            nState = nState - 1 > 0 ? nState - 1 : nState;
            return {
                ...state,
                [action.id]: nState,
            };
        }

        default:
            return state;
    }
};

export default cartReducer;
