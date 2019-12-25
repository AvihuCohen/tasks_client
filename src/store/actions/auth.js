import axios from '../../axios/axios-todo-lists';
import * as actionTypes from './actionTypes';


const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};


const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    };
};


const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};


export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const authResetError = () => {
    return {
        type: actionTypes.AUTH_RESET_ERROR
    };
};

const createMyDayList = () => {
    console.log("CreateMyDayList ");
    const formData = new FormData();
    formData.append('name', "My Day");
    formData.append('isPublic', false);
    formData.append('isRemovable', false);

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token').toString();

   return axios.post('http://localhost:8080/admin/list', formData);

};

export const signUp = (email, password, name, signUp) => {
    return dispatch => {
        dispatch(authStart());
        let url = '/auth/login';

        const formData = new FormData();

        if (signUp) {
            formData.append('name', name);
            url = '/auth/signup';
        }

        formData.append('email', email);
        formData.append('password', password);

        axios.post(url, formData)
            .then(res => {
                const expirationDate = new Date(new Date().getTime() + res.data.expiresTimeInMiliseconds);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', res.data.userId);
                let timeToLogout = expirationDate.getTime() - new Date().getTime();

                dispatch(checkAuthTimeout(timeToLogout));

                if (signUp) {
                    createMyDayList()
                        .then(res => {
                            dispatch(authSuccess(res.data.token, res.data.userId));
                            // console.log("New list was created.");
                        })
                        .catch(err => {
                            console.log("Error while trying to create new list.");
                            console.log(err);
                        });
                }else{
                    dispatch(authSuccess(res.data.token, res.data.userId));
                }
                return res;
            })
            .catch(err => {
                console.log(err.response);
                dispatch(authFail(err.response.data.message));
            });
    }
};


export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
            }
        }
    };
};














