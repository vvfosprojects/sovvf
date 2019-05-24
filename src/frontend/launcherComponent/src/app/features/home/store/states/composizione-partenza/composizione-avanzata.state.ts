import { Action, Selector, State, StateContext } from '@ngxs/store';

// Interface
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';

// Action

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { GetListeCoposizioneAvanzata, SetListaSquadreComposizione, SetListaMezziComposizione } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

// State

export interface ComposizioneAvanzataStateModel {
    squadreComposizione: SquadraComposizione[];
    mezziComposizione: MezzoComposizione[];
}

export const ComposizioneAvanzataStateDefaults: ComposizioneAvanzataStateModel = {
    squadreComposizione: [],
    mezziComposizione: []
};

@State<ComposizioneAvanzataStateModel>({
    name: 'composizioneAvanzata',
    defaults: ComposizioneAvanzataStateDefaults
})
export class ComposizioneAvanzataState {

    @Selector()
    static squadreComposizione(state: ComposizioneAvanzataStateModel) {
        return state.squadreComposizione;
    }

    @Selector()
    static mezziComposizione(state: ComposizioneAvanzataStateModel) {
        return state.mezziComposizione;
    }

    constructor(private squadreService: CompPartenzaService) {
    }

    // SET
    @Action(GetListeCoposizioneAvanzata)
    getSquadreComposizione({ dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: GetListeCoposizioneAvanzata) {
        this.squadreService.getListeComposizioneAvanzata(action.filtri).subscribe((res: any) => {
            console.log('Composizione Partenza Avanzata Service', res);
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetListaSquadreComposizione)
    setSquadreComposizione({ patchState }: StateContext<ComposizioneAvanzataStateModel>, action: SetListaSquadreComposizione) {
        patchState({
            squadreComposizione: action.squadreComposizione
        });
    }

    @Action(SetListaMezziComposizione)
    setMezziComposizione({ patchState }: StateContext<ComposizioneAvanzataStateModel>, action: SetListaMezziComposizione) {
        patchState({
            mezziComposizione: action.mezziComposizione
        });
    }
}
