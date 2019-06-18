import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

// Action
import { GetPreAccoppiati, SetPreAccoppiati } from '../../actions/composizione-partenza/pre-accoppiati.actions';

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { GetListeCoposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ComposizionePartenzaState } from './composizione-partenza-state';
import { MezziComposizioneState } from './mezzi-composizione.state';
import { SquadreComposizioneState } from './squadre-composizione.state';
import { ComposizioneAvanzataStateModel } from './composizione-avanzata.state';

export interface PreAccoppiatiStateModel {
    preAccoppiati: BoxPartenza[];
}

export const PreAccoppiatiStateModelStateDefaults: PreAccoppiatiStateModel = {
    preAccoppiati: []
};

@State<PreAccoppiatiStateModel>({
    name: 'preAccoppiati',
    defaults: PreAccoppiatiStateModelStateDefaults
})
export class PreAccoppiatiState {

    // SELECTORS
    @Selector()
    static preAccoppiati(state: PreAccoppiatiStateModel) {
        return state.preAccoppiati;
    }

    constructor(private preAccoppiatiService: CompPartenzaService,
                private store: Store) {
    }

    @Action(GetPreAccoppiati)
    getPreAccoppiati({ getState, dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: GetPreAccoppiati) {
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
        this.preAccoppiatiService.getPreAccoppiati(filtri).subscribe(() => {
            // console.log('Composizione Partenza Veloce Service');
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }


    @Action(SetPreAccoppiati)
    setPreAccoppiati({ patchState }: StateContext<PreAccoppiatiStateModel>, action: SetPreAccoppiati) {
        patchState({
            preAccoppiati: action.boxPartenza
        });
    }
}
