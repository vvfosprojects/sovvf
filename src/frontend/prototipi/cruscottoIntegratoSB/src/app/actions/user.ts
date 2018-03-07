import { User } from "../login/_models/user";
import { Action } from '@ngrx/store';

export const USERLOGIN = '[User] Login';
export const USERLOGEDIN = '[User] Loggedin';

export class UserLoginAction implements Action {
    type = USERLOGIN;
 
    constructor(public payload: User) { }
}

export class UserLoggedinAction implements Action {
    type = USERLOGEDIN;

    constructor(public payload: User) { }
}