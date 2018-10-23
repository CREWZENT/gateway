
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// reducers
const defaultState = {
    user: null,
    TeneAddress: null,
    HrTestAddress: null,
    TeneCoin: null,
    HrTest: null,
    balance: 0,
    Gateway: null
};

const user = (state = defaultState.user, action) => {
    switch (action.type) {
        case 'changeUser':
            return action.data;
        default:
            return state;
    }
};

const TeneAddress = (state = defaultState.TeneAddress, action) => {
    switch (action.type) {
        case 'TeneAddress':
            return action.data;
        default:
            return state;
    }
};

const HrTestAddress = (state = defaultState.HrTestAddress, action) => {
    switch (action.type) {
        case 'HrTestAddress':
            return action.data;
        default:
            return state;
    }
};

const TeneCoin = (state = defaultState.TeneCoin, action) => {
    switch (action.type) {
        case 'TeneCoin':
            return action.data;
        default:
            return state;
    }
};

const HrTest = (state = defaultState.HrTest, action) => {
    switch (action.type) {
        case 'HrTest':
            return action.data;
        default:
            return state;
    }
};

const balance = (state = defaultState.balance, action) => {
    switch (action.type) {
        case 'setBalance':
            return Math.round(action.data * 100) / 100;
        default:
            return state;
    }
};

const Gateway = (state = defaultState.Gateway, action) => {
    switch (action.type) {
        case 'Gateway':
            return action.data;
        default:
            return state;
    }
};


const MainReducers = combineReducers({
    user,
    TeneAddress,
    HrTestAddress,
    TeneCoin,
    HrTest,
    balance,
    Gateway
});

// store
const store = createStore(MainReducers, applyMiddleware(thunkMiddleware));
export default store;