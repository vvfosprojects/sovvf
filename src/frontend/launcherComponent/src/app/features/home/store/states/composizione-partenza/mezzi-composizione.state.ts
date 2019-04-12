import { Action, Selector, State, StateContext } from '@ngxs/store';

// Interface
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

// Action
import { GetMezziComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';

export interface MezziComposizioneStateModel {
    mezziComposizione: MezzoComposizione[];
}

export const MezziComposizioneStateDefaults: MezziComposizioneStateModel = {
    mezziComposizione: []
};

@State<MezziComposizioneStateModel>({
    name: 'mezziComposizione',
    defaults: MezziComposizioneStateDefaults
})
export class MezziComposizioneState {

    // SELECTORS
    @Selector()
    static mezziComposizione(state: MezziComposizioneStateModel) {
        return state.mezziComposizione;
    }

    constructor(private mezziService: CompPartenzaService) { }

    @Action(GetMezziComposizione)
    getMezziComposizione({ getState, patchState }: StateContext<MezziComposizioneStateModel>) {
        const state = getState();

        this.mezziService.getMezziComposizione().subscribe((m: MezzoComposizione[]) => {
            patchState({
                ...state,
                mezziComposizione: m
            });
        });

    }
}
