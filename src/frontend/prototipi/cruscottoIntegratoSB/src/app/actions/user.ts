import { User } from '../login/_models/user';
import { Action } from '@ngrx/store';

export const USERLOGIN = '[User] Userlogin';
export const USERLOGINSUCCESS = '[User] USERLOGINSUCCESS';

export class UserloginAction implements Action {
    type = USERLOGIN;

    constructor(public payload: User) {}
}

export class UserloginSuccess implements Action {
    type = USERLOGINSUCCESS;

    constructor(public payload: User) {}
}