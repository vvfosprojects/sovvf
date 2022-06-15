import { Selector, State, Action, StateContext } from '@ngxs/store';
import { ListaTipologicheMezzi } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { SetTipologicheMezzi } from '../../actions/composizione-partenza/tipologiche-mezzi.actions';
import { TipologicaComposizionePartenza } from '../../../composizione-partenza/interface/filtri/tipologica-composizione-partenza.interface';
import { Injectable } from '@angular/core';
import { GetFiltriComposizione } from '../../../../../shared/store/actions/filtri-composizione/filtri-composizione.actions';

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
    static generiMezzi(state: TipologicheMezziStateModel): TipologicaComposizionePartenza[] {
        return state.tipologiche.generiMezzi;
    }

    @Action(SetTipologicheMezzi)
    setTipologicheMezzi({ patchState, dispatch }: StateContext<TipologicheMezziStateModel>, action: SetTipologicheMezzi): void {
        patchState({
            tipologiche: action.tipologiche
        });
        dispatch(new GetFiltriComposizione());
    }
}
