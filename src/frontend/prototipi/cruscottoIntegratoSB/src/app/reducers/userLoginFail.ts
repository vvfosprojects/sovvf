import { ActionReducer, Action } from '@ngrx/store';
import * as amount from '../actions/user';
//import { User } from '../login/_models/user';

export function reducer(state: any = "Error: Username o password errate", action: amount.UserloginFail) {
    switch (action.type) {
        case amount.USERLOGINFAIL:
            return action.payload;
        default:
            return state;
    }
}