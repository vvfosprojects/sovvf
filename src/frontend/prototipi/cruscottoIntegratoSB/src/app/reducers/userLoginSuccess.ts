import { ActionReducer, Action } from '@ngrx/store';
import * as user from '../actions/user';
import { User } from '../login/_models/user';

export function reducer(state: User, action: user.UserloginSuccess) {
    switch (action.type) {
        case user.USERLOGINSUCCESS:
            return action.payload;
        default:
            return state;
    }
}