import { Selector, State, Action, StateContext } from '@ngxs/store';
import { ListaFiltriComposizione } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { SetFiltriComposizione } from '../../actions/composizione-partenza/filtri-composizione.actions';

export interface FiltriComposizioneStateModel {
    filtri: ListaFiltriComposizione;
}

export const FiltriComposizioneStateDefaults: FiltriComposizioneStateModel = {
    filtri: null
};


@State<FiltriComposizioneStateModel>({
    name: 'filtriComposizione',
    defaults: FiltriComposizioneStateDefaults
})

export class FiltriComposizioneState {

    @Selector()
    static filtri(state: FiltriComposizioneStateModel) {
        return state.filtri;
    }

    @Action(SetFiltriComposizione)
    updateListe({ patchState }: StateContext<FiltriComposizioneStateModel>, action: SetFiltriComposizione) {
        patchState({
            filtri: action.filtri
        });
    }
}
