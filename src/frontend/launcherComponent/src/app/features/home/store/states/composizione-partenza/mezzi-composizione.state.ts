import { Action, Selector, State, StateContext } from '@ngxs/store';

// Interface
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

// Action
import { GetMezziComposizione, SetMezziComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';

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

    constructor(private mezziService: CompPartenzaService) {
    }

    @Action(GetMezziComposizione)
    getMezziComposizione({ dispatch }: StateContext<MezziComposizioneStateModel>) {
        this.mezziService.getMezziComposizione().subscribe((m: MezzoComposizione[]) => {
            // dispatch(new SetMezziComposizione(m));
        }, () => dispatch(new ShowToastr('error', 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetMezziComposizione)
    setMezziComposizione({ patchState }: StateContext<MezziComposizioneStateModel>, action: SetMezziComposizione) {
        patchState({
            mezziComposizione: action.mezzoComposizione
        });
    }
}
