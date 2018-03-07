import { ActionReducer, Action } from '@ngrx/store';
import { User } from "../login/_models/user";
import * as user from '../actions/user';


//state è number ma è sbagliato.
export function reducer(state: User, action: user.UserLoginAction) {
    switch (action.type) {
        case user.USERLOGIN:
            return action.payload;
        default:
            return state;
    }
}