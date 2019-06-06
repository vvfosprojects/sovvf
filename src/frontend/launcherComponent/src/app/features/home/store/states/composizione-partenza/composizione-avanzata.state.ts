import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { GetListeCoposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { MezziComposizioneState } from './mezzi-composizione.state';
import { SquadreComposizioneState } from './squadre-composizione.state';

export interface ComposizioneAvanzataStateModel {
    listaMezziSquadre: Array<any>;
}

export const ComposizioneAvanzataStateDefaults: ComposizioneAvanzataStateModel = {
    listaMezziSquadre: []
};

@State<ComposizioneAvanzataStateModel>({
    name: 'composizioneAvanzata',
    defaults: ComposizioneAvanzataStateDefaults,
    children: [MezziComposizioneState, SquadreComposizioneState]
})
export class ComposizioneAvanzataState {

    @Selector()
    static listaMezziSquadre(state: ComposizioneAvanzataStateModel) {
        return state.listaMezziSquadre;
    }

    constructor(private squadreService: CompPartenzaService) {
    }

    // SET
    @Action(GetListeCoposizioneAvanzata)
    getListeComposizione({ dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: GetListeCoposizioneAvanzata) {
        this.squadreService.getListeComposizioneAvanzata(action.filtri).subscribe(() => {
            // console.log('Composizione Partenza Avanzata Service');
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }
}
