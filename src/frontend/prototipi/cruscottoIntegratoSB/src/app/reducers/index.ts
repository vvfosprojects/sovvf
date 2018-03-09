// stato dell'applicazione
import * as fromUserLogin from './userLogin';
import * as fromUserLoginSuccess from './userLoginSuccess';
import * as fromUserLoginFail from './userLoginFail';

import { User } from "../login/_models/user";

export interface State {
   // amount: number;
    userLogin: User;
    userLoginSuccess: User;
    userLoginFail: User;
}

export const reducers = {
    userLogin: fromUserLogin.reducer,
    userLoginSuccess: fromUserLoginSuccess,
    userLoginFail: fromUserLoginFail
};

export const getUserLoginState = (state: State) => state.userLogin;
export const getUserLoginSuccessState = (state: State) => state.userLoginSuccess;
export const getUserLoginFailState = (state: State) => state.userLoginFail;
