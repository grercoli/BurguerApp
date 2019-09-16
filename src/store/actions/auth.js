import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
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

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000); //multiplico por 1000 para llevar 3600 ms a 1 hora
    };
};

export const auth = (email, password, isSignUp) => { //this will do  the authentication
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDAWq2U9FzlQROTA3LNGys1XBx0_E3B880'; // sign-up default url
        if (!isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDAWq2U9FzlQROTA3LNGys1XBx0_E3B880';
        }
        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000); //el new date().getTime() me da la hora actual a eso le sumo 1 hora que dura el token y para convertirlo devuelta en un objeto date encapsulo todo en un new Date(...)
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error)); //we can get access to the error message we get from firebase. With axios we can go back to the response
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {  //to succesfully automatically log the user in if we have a valid token. Mas que nada sirve para cuando se refresca la pagina que el usuario siga conectado
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate')); //lo que obtenemos de localStorage es un string pero con new Date lo convierte en formato fecha
            if (expirationDate <= new Date()) { //si es menor o igual en ese caso no quiero loguearme
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 )); //it's the amount of seconds until we should be logged out. expirationDate es la fecha pero no la cantidad de segundos entonces hago toda esta cuenta
            }   
        }
    };
};