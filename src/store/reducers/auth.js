import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    lists: null,
    disabled: false,
    currentList: null
};

const authStart = (state, action) => {
    return updateObject(state, { error: null, loading: true });
};

const authFail = (state, action) => {
    return updateObject(state, { error: action.error, loading: false });
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false,
        token: action.token,
        userId: action.userId
    });
};

const authLogout = (state, action) => {
    return updateObject(state, { token: null, userId: null , loading: false, lists: null, error: null});
};
const resetError = (state, action) => {
    return updateObject(state, { error: null});
};

const setLists = (state, action) => {
    return updateObject(state, { lists: action.lists});
};

const disableAddTaskStart = (state, action) => {
    return updateObject(state, { disabled: true, list: action.list});
};

const disableAddTaskSuccess = (state, action) => {
    return updateObject(state, { disabled: false});
};

const setCurrentList = (state, action) => {
    return updateObject(state, { currentList: action.list});
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.AUTH_RESET_ERROR: return resetError(state, action);
        case actionTypes.AUTH_GET_LISTS: return setLists(state, action);
        case actionTypes.DISABLE_ADD_TASK_START: return disableAddTaskStart(state, action);
        case actionTypes.DISABLE_ADD_TASK_SUCCESS: return disableAddTaskSuccess(state, action);
        case actionTypes.SET_CURRENT_LIST: return setCurrentList(state, action);
        default:
            return state;
    }
};

export default reducer;