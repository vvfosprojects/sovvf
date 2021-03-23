import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Tipologia } from '../../../model/tipologia.model';
import { GetTipologie, SetTipologie } from '../../actions/tipologie/tipologie.actions';
import { TipologieService } from '../../../../core/service/tipologie/tipologie.service';

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

    @Selector()
    static tipologie(state: TipologieStateModel): Tipologia[] {
        return state.tipologie;
    }

    constructor(private tipologieService: TipologieService) {
    }

    @Action(GetTipologie)
    getTipologie({ dispatch }: StateContext<TipologieStateModel>): void {
        this.tipologieService.getTipologie().subscribe((tipologie: Tipologia[]) => {
            dispatch(new SetTipologie(tipologie));
        });
    }

    @Action(SetTipologie)
    setTipologie({ patchState }: StateContext<TipologieStateModel>, action: SetTipologie): void {
        patchState({
            tipologie: action.tipologie
        });
    }

}
