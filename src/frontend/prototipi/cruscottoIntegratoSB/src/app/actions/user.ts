import { User } from '../login/_models/user';
import { Action } from '@ngrx/store';

export const USERLOGIN = '[User] Userlogin';
export const USERLOGINSUCCESS = '[User] USERLOGINSUCCESS';
export const USERLOGINFAIL = '[User] USERLOGINFAIL';
export const USERLOGOUT = '[User] USERLOGOUT';

export class UserloginAction implements Action {
    type = USERLOGIN;

    constructor(public payload: User) {}
}

export class UserloginSuccess implements Action {
    type = USERLOGINSUCCESS;

    constructor(public payload: User) {}
}

export class UserloginFail implements Action {
    type = USERLOGINFAIL;

    constructor(public payload: any) {}
}

export class Userlogout implements Action {
    type = USERLOGOUT;

    constructor(public payload: any) {}
}