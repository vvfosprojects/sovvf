import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { GetFiltriComposizione, SetFiltriComposizione } from '../../actions/composizione-partenza/filterbar-composizione.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';

export interface FilterbarComposizioneStateModel {
    filtri: any;
}

export const FiltriComposizioneStateDefaults: FilterbarComposizioneStateModel  = {
    filtri: null
};

@State<FilterbarComposizioneStateModel>({
    name: 'filterbarComposizione',
    defaults: FiltriComposizioneStateDefaults
})
export class FilterbarComposizioneState {

    // SELECTORS
    @Selector()
    static filtri(state: FilterbarComposizioneStateModel ) {
        return state.filtri;
    }

    constructor(private compPartenzaService: CompPartenzaService) {
    }

    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<FilterbarComposizioneStateModel >) {
        this.compPartenzaService.getFiltri().subscribe((filtri: any) => {
            dispatch(new SetFiltriComposizione(filtri));
        }, () => dispatch(new ShowToastr('error', 'Errore', 'Il server web non risponde', 5)));

    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ patchState }: StateContext<FilterbarComposizioneStateModel >, action: SetFiltriComposizione) {
        patchState({
            filtri: action.filtri
        });
    }
}
