import { ActionReducer, Action } from '@ngrx/store';
import * as user from '../actions/user';
import { User } from '../../login/_models/user';

export function reducer(state: User, action: user.UserloginAction) {
    switch (action.type) {
        case user.USERLOGIN:
            return action.payload;
        default:
            return state;
    }
}