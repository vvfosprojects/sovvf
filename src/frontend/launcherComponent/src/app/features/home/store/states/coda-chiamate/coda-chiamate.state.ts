import { Action, Selector, State } from '@ngxs/store';
import { Injectable } from '@angular/core';

export interface CodaChiamateStateModel {
    data: any;
}

export const CodaChiamateStateDefaults: CodaChiamateStateModel = {
    data: null
};

@Injectable()
@State<CodaChiamateStateModel>({
    name: 'codaChiamate',
    defaults: CodaChiamateStateDefaults
})
export class CodaChiamateState {

}
