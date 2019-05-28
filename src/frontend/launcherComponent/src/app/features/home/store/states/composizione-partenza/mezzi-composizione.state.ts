import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { GetListeCoposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { SetListaMezziComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';

export interface MezziComposizioneStateStateModel {
    mezziComposizione: MezzoComposizione[];
}

export const MezziComposizioneStateDefaults: MezziComposizioneStateStateModel = {
    mezziComposizione: []
};

@State<MezziComposizioneStateStateModel>({
    name: 'mezziComposizione',
    defaults: MezziComposizioneStateDefaults
})
export class MezziComposizioneState {

    @Selector()
    static mezziComposizione(state: MezziComposizioneStateStateModel) {
        return state.mezziComposizione;
    }

    constructor() {
    }

    // SET
    @Action(SetListaMezziComposizione)
    setListaMezziComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: SetListaMezziComposizione) {
        patchState({
            mezziComposizione: action.mezziComposizione
        });
    }
}
