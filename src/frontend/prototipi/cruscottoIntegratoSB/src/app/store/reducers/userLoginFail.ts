import { ActionReducer, Action } from '@ngrx/store';
import * as user from '../actions/user';
//import { User } from '../login/_models/user';

export function reducer(state: any, action: user.UserloginFail) {
    switch (action.type) {
        case user.USERLOGINFAIL:
            return action.payload;
        default:
            return state;
    }
}