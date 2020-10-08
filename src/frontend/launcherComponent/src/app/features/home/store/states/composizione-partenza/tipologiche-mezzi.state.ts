import { Selector, State, Action, StateContext } from '@ngxs/store';
import { ListaTipologicheMezzi } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { SetTipologicheMezzi } from '../../actions/composizione-partenza/tipologiche-mezzi.actions';
import { DescrizioneTipologicaMezzo } from '../../../composizione-partenza/interface/filtri/descrizione-filtro-composizione-interface';
import { Injectable } from '@angular/core';

export interface TipologicheMezziStateModel {
    tipologiche: ListaTipologicheMezzi;
}

export const TipologicheMezziStateDefaults: TipologicheMezziStateModel = {
    tipologiche: null
};


@Injectable()
@State<TipologicheMezziStateModel>({
    name: 'tipologicheMezzi',
    defaults: TipologicheMezziStateDefaults
})

export class TipologicheMezziState {

    @Selector()
    static tipologiche(state: TipologicheMezziStateModel): ListaTipologicheMezzi {
        return state.tipologiche;
    }

    @Selector()
    static generiMezzi(state: TipologicheMezziStateModel): DescrizioneTipologicaMezzo[] {
        return state.tipologiche.generiMezzi;
    }

    @Action(SetTipologicheMezzi)
    setTipologicheMezzi({ patchState }: StateContext<TipologicheMezziStateModel>, action: SetTipologicheMezzi): void {
        patchState({
            tipologiche: action.tipologiche
        });
    }
}
