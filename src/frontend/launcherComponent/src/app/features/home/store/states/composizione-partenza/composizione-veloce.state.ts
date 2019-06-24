import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

// Action
import { ClearListaComposizioneVeloce, GetListaComposizioneVeloce, SetListaComposizioneVeloce } from '../../actions/composizione-partenza/composizione-veloce.actions';

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ComposizionePartenzaState } from './composizione-partenza-state';
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
export class ComposizioneVeloceState {

    // SELECTORS
    @Selector()
    static preAccoppiati(state: PreAccoppiatiStateModel) {
        return state.preAccoppiati;
    }

    constructor(private preAccoppiatiService: CompPartenzaService,
                private store: Store) {
    }

    @Action(GetListaComposizioneVeloce)
    getPreAccoppiati({ getState, dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: GetListaComposizioneVeloce) {
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
        this.preAccoppiatiService.getPreAccoppiati(filtri).subscribe((preAccoppiati: BoxPartenza[]) => {
            this.store.dispatch(new SetListaComposizioneVeloce(preAccoppiati));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }


    @Action(SetListaComposizioneVeloce)
    setPreAccoppiati({ patchState }: StateContext<PreAccoppiatiStateModel>, action: SetListaComposizioneVeloce) {
        patchState({
            preAccoppiati: action.boxPartenza
        });
    }

    @Action(ClearListaComposizioneVeloce)
    clearListaComposizioneVeloce({ patchState }: StateContext<PreAccoppiatiStateModel>) {
        patchState({
            preAccoppiati: null
        });
    }
}
