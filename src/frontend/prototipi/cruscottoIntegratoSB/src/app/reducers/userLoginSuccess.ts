import { ActionReducer, Action } from '@ngrx/store';
import * as amount from '../actions/user';
import { User } from '../login/_models/user';

export function reducer(state: User, action: amount.UserloginSuccess) {
    switch (action.type) {
        case amount.USERLOGINSUCCESS:
            return action.payload;
        default:
            return state;
    }
}