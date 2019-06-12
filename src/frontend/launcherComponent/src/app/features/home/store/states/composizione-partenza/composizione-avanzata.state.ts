import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { GetListeCoposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { MezziComposizioneState } from './mezzi-composizione.state';
import { SquadreComposizioneState } from './squadre-composizione.state';
import { ComposizionePartenzaState } from './composizione-partenza-state';

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


    constructor(private squadreService: CompPartenzaService,
                private store: Store) {
    }

    // SET
    @Action(GetListeCoposizioneAvanzata)
    getListeComposizione({ getState, dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: GetListeCoposizioneAvanzata) {
        const filtri = {};
        if (action.filtri) {
            filtri['CodiceDistaccamento'] = action.filtri.CodiceDistaccamento;
            filtri['CodiceStatoMezzo'] = action.filtri.CodiceStatoMezzo;
            filtri['CodiceTipoMezzo'] = action.filtri.CodiceTipoMezzo;
        } else {
            filtri['CodiceDistaccamento'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceDistaccamento;
            filtri['CodiceStatoMezzo'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceStatoMezzo;
            filtri['CodiceTipoMezzo'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo;
        }
        filtri['CodiceMezzo'] = this.store.selectSnapshot(MezziComposizioneState.idMezzoSelezionato) ? this.store.selectSnapshot(MezziComposizioneState.idMezzoSelezionato) : [];
        filtri['CodiceSquadra'] = this.store.selectSnapshot(SquadreComposizioneState.idSquadreSelezionate) ? this.store.selectSnapshot(SquadreComposizioneState.idSquadreSelezionate) : [];
        filtri['idRichiesta'] = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione) ? this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id : '';


        console.log(filtri);
        this.squadreService.getListeComposizioneAvanzata(filtri).subscribe(() => {
            // console.log('Composizione Partenza Avanzata Service');
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }
}
