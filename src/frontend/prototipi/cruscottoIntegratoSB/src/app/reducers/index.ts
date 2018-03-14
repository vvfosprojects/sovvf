import * as fromAmount from './amount';
import * as fromCurrency from './currency';
import * as fromUserLoginSuccess from './userLoginSuccess';
import * as fromUserLoginFail from './userLoginFail';
import * as fromUserLogin from './userLogin';
import { Currency } from './../models/currency';
import { User } from '../login/_models/user';

export interface State {
    amount: number;
    currencies: Currency[];
    userLoginSuccess: User;
    userLoginFail: any;
    userLogin: User;
};

export const reducers = {
    amount: fromAmount.reducer,
    currencies: fromCurrency.reducer,
    userLoginSuccess: fromUserLoginSuccess.reducer,
    userLoginFail: fromUserLoginFail.reducer,
    userLogin: fromUserLogin.reducer
};

export const getAmountState = (state: State) => state.amount;

export const getCurrnecyRates = (state: State) => state.currencies;

export const getUserLoginSuccessState = (state: State) => state.userLoginSuccess;

export const getUserLoginFailState = (state: State) => state.userLoginFail;

export const getUserLoginState = (state: State) => state.userLogin;