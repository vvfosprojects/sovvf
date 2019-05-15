import { Action, Selector, State, StateContext } from '@ngxs/store';

// Interface
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';

// Action

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { GetSquadreComposizione, SetSquadreComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';

// State

export interface SquadreComposizioneStateModel {
    squadreComposizione: SquadraComposizione[];
}

export const SquadreComposizioneStateDefaults: SquadreComposizioneStateModel = {
    squadreComposizione: []
};

@State<SquadreComposizioneStateModel>({
    name: 'squadreComposizione',
    defaults: SquadreComposizioneStateDefaults
})
export class SquadreComposizioneState {

    // SELECTORS
    @Selector()
    static squadreComposizione(state: SquadreComposizioneStateModel) {
        return state.squadreComposizione;
    }

    constructor(private squadreService: CompPartenzaService) {
    }

    // SET
    @Action(GetSquadreComposizione)
    getSquadreComposizione({ dispatch }: StateContext<SquadreComposizioneStateModel>) {
        this.squadreService.getSquadre().subscribe((s: SquadraComposizione[]) => {
            // dispatch(new SetSquadreComposizione(s));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetSquadreComposizione)
    setSquadreComposizione({ patchState }: StateContext<SquadreComposizioneStateModel>, action: SetSquadreComposizione) {
        patchState({
            squadreComposizione: action.squadraComposizione
        });
    }
}
