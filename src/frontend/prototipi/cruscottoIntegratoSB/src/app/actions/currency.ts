import { Currency } from './../models/currency';
import { Action } from '@ngrx/store';

export const CURRENCIESUPDATE = '[Currency] UpdateAll';
export const CURRENCIESUPDATED = '[Currency] UpdatedAll';

export class CurrenciesUpdateAction implements Action {
    type = CURRENCIESUPDATE;
}

export class CurrenciesUpdatedAction implements Action {
    type = CURRENCIESUPDATED;

    constructor(public payload: Currency[]) {}
}