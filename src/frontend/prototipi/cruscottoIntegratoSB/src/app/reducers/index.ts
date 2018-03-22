import * as fromUserLoginSuccess from './userLoginSuccess';
import * as fromUserLoginFail from './userLoginFail';
import * as fromUserLogin from './userLogin';
import { User } from '../login/_models/user';

export interface State {
    userLoginSuccess: User;
    userLoginFail: any;
    userLogin: User;
};

export const reducers = {
    userLoginSuccess: fromUserLoginSuccess.reducer,
    userLoginFail: fromUserLoginFail.reducer,
    userLogin: fromUserLogin.reducer
};

export const getUserLoginSuccessState = (state: State) => state.userLoginSuccess;

export const getUserLoginFailState = (state: State) => state.userLoginFail;

export const getUserLoginState = (state: State) => state.userLogin;