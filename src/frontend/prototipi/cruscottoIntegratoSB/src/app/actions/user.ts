import { User } from "../login/_models/user";
import { Action } from '@ngrx/store';

export const USERLOGIN = '[User] Login';
export const USERLOGINSUCCESS = '[User] Loginsuccess';
export const USERLOGINFAIL = '[User] Loginfail';

export class UserLoginAction implements Action {
    type = USERLOGIN;
 
    constructor(public payload: User) { }
}

export class UserLoginSuccess implements Action {
    type = USERLOGINSUCCESS;

    constructor(public payload: User) { }
}

export class UserLoginFail implements Action {
    type = USERLOGINFAIL;

    //constructor(public payload: User) { }
}