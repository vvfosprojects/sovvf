import { Action, Selector, State, StateContext, NgxsOnInit } from '@ngxs/store';

// Interface
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';

// Action

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { GetSquadreComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';

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

    constructor(private squadreService: CompPartenzaService) { }

    // SET
    @Action(GetSquadreComposizione)
    getSquadreComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateModel>) {
        const state = getState();

        this.squadreService.getSquadre().subscribe((s: SquadraComposizione[]) => {
            patchState({
                ...state,
                squadreComposizione: s
            });
        });
    }
}
