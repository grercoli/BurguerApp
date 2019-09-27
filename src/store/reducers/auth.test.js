import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer', () => {
    it('should return the initial state', () => {
        // Now inside expect I simply execute the code I want to test, just as like wrapper but now with a normal javascript function
        // I will pass undefined as an initial state (it's just when we are initializing our app) and then i pass a no specific action {}
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        });
    });

    it('should store the token upon login', () => {
        // I execute the reducer function with the initial state
        // then to the action i pass the action types and the correct payload
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'some-token',
            userId: 'some-user-id'
         })).toEqual({
            token: 'some-token',
            userId: 'some-user-id',
            error: null,
            loading: false,
            authRedirectPath: '/'
        });
    });
});