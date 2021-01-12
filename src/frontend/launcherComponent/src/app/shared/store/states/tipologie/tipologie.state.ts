import { State } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Tipologia } from '../../../model/tipologia.model';

export interface TipologieStateModel {
    tipologie: Tipologia[];
}

export const TipologieStateDefaults: TipologieStateModel = {
    tipologie: null
};

@Injectable()
@State<TipologieStateModel>({
    name: 'tipologie',
    defaults: TipologieStateDefaults
})
export class TipologieState {

    constructor() {
    }

}
