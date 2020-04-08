import { Selector, State, Action, StateContext } from '@ngxs/store';
import { ListaTipologicheMezzi } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { SetTipologicheMezzi } from '../../actions/composizione-partenza/tipologiche-mezzi.actions';

export interface TipologicheMezziStateModel {
    tipologiche: ListaTipologicheMezzi;
}

export const TipologicheMezziStateDefaults: TipologicheMezziStateModel = {
    tipologiche: null
};


@State<TipologicheMezziStateModel>({
    name: 'tipologicheMezzi',
    defaults: TipologicheMezziStateDefaults
})

export class TipologicheMezziState {

    @Selector()
    static tipologiche(state: TipologicheMezziStateModel) {
        return state.tipologiche;
    }

    @Selector()
    static generiMezzi(state: TipologicheMezziStateModel) {
        return state.tipologiche.generiMezzi;
    }

    @Action(SetTipologicheMezzi)
    setTipologicheMezzi({ patchState }: StateContext<TipologicheMezziStateModel>, action: SetTipologicheMezzi) {
        patchState({
            tipologiche: action.tipologiche
        });
    }
}
