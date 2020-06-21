const orderReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ORDER_IN': {
            return { orderNum: action.orderNum };
        }

        case 'ORDER_OUT': {
            return {};
        }

        case 'PACKAGE_HISTORY_IN': {
            return { packageID: action.packageID };
        }

        case 'PACKAGE_HISTORY_OUT': {
            return {};
        }

        case 'PACKAGE_SUBSC_IN': {
            return { packageSubscID: action.packageSubscID };
        }

        case 'PACKAGE_SUBSC_OUT': {
            return {};
        }

        case 'GATHERING_HISTORY_IN': {
            return { gatheringID: action.gatheringID };
        }

        case 'GATHERING_HISTORY_OUT': {
            return {};
        }

        default:
            return state;
    }
};

export default orderReducer;
