import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { GetListeCoposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { MezziComposizioneState } from './mezzi-composizione.state';
import { SquadreComposizioneState } from './squadre-composizione.state';
import { ComposizionePartenzaState } from './composizione-partenza-state';
import { SetListaMezziComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { SetListaSquadreComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';

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

    @Action(GetListeCoposizioneAvanzata)
    getListeComposizioneAvanzata({ getState, dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: GetListeCoposizioneAvanzata) {
        const filtri = {};
        if (action.filtri) {
            filtri['CodiceDistaccamento'] = action.filtri.CodiceDistaccamento.length > 0 ? action.filtri.CodiceDistaccamento : [''];
            filtri['CodiceStatoMezzo'] = action.filtri.CodiceStatoMezzo.length > 0 ? action.filtri.CodiceStatoMezzo : [''];
            filtri['CodiceTipoMezzo'] = action.filtri.CodiceTipoMezzo.length > 0 ? action.filtri.CodiceTipoMezzo : [''];
        } else {
            filtri['CodiceDistaccamento'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
            filtri['CodiceStatoMezzo'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceStatoMezzo.length > 0 ? this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
            filtri['CodiceTipoMezzo'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo.length > 0 ? this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
        }
        filtri['CodiceMezzo'] = [''];
        filtri['CodiceSquadra'] = [''];
        filtri['idRichiesta'] = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione) ? this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id : '';

        console.log(filtri);
        this.squadreService.getListeComposizioneAvanzata(filtri).subscribe((listeCompAvanzata: any) => {
            if (listeCompAvanzata) {
                if (listeCompAvanzata.composizioneMezzi) {
                    this.store.dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezzi));
                }
                if (listeCompAvanzata.composizioneSquadre) {
                    this.store.dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadre));
                }
                // console.log('listeCompAvanzata', listeCompAvanzata);
            }
            // console.log('Composizione Partenza Avanzata Service');
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }
}
