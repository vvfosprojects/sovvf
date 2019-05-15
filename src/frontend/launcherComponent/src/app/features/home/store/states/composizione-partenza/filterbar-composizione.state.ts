import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { GetFiltriComposizione, SetFiltriComposizione } from '../../actions/composizione-partenza/filterbar-composizione.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { FilterbarService } from '../../../../../core/service/comp-partenza-service/filterbar-composizione-service/filterbar.service';
import { ToastrType } from '../../../../../shared/enum/toastr';

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

    constructor(private filterbar: FilterbarService) {
    }

    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<FilterbarComposizioneStateModel >) {
        this.filterbar.getFiltri().subscribe((filtri: any) => {
            dispatch(new SetFiltriComposizione(filtri));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));

    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ patchState }: StateContext<FilterbarComposizioneStateModel >, action: SetFiltriComposizione) {
        patchState({
            filtri: action.filtri
        });
    }
}
