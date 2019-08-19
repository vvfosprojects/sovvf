import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

// Action
import {
    ClearComposizioneVeloce,
    ClearListaComposizioneVeloce,
    GetListaComposizioneVeloce, SelectPreAccoppiatoComposizione,
    SetListaComposizioneVeloce, UnselectPreAccoppiatoComposizione, UpdateMezzoPreAccoppiatoComposizione
} from '../../actions/composizione-partenza/composizione-veloce.actions';

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ComposizionePartenzaState } from './composizione-partenza.state';
import { ComposizioneAvanzataStateModel } from './composizione-avanzata.state';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { makeCopy } from '../../../../../shared/helper/function';

export interface PreAccoppiatiStateModel {
    preAccoppiati: BoxPartenza[];
    idPreAccoppiati: string[];
    idPreAccoppiatoSelezionato: string;
    idPreAccoppiatiSelezionati: string[];
}

export const PreAccoppiatiStateModelStateDefaults: PreAccoppiatiStateModel = {
    preAccoppiati: [],
    idPreAccoppiati: [],
    idPreAccoppiatoSelezionato: null,
    idPreAccoppiatiSelezionati: []
};

@State<PreAccoppiatiStateModel>({
    name: 'preAccoppiati',
    defaults: PreAccoppiatiStateModelStateDefaults
})
export class ComposizioneVeloceState {

    @Selector()
    static preAccoppiati(state: PreAccoppiatiStateModel) {
        return state.preAccoppiati;
    }

    @Selector()
    static idPreAccoppiatoSelezionato(state: PreAccoppiatiStateModel) {
        return state.idPreAccoppiatoSelezionato;
    }

    @Selector()
    static idPreAccoppiatiSelezionati(state: PreAccoppiatiStateModel) {
        return state.idPreAccoppiatiSelezionati;
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
            // tslint:disable:max-line-length
            filtri['CodiceDistaccamento'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
            filtri['CodiceStatoMezzo'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceStatoMezzo.length > 0 ? this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
            filtri['CodiceTipoMezzo'] = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo.length > 0 ? this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
            // tslint:enable:max-line-length
        }
        filtri['CodiceMezzo'] = [''];
        filtri['CodiceSquadra'] = [''];
        // filtri['idRichiesta'] = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione) ? this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id : '';
        filtri['idRichiesta'] = '1';

        console.log(filtri);
        this.preAccoppiatiService.getPreAccoppiati(filtri).subscribe((preAccoppiati: BoxPartenza[]) => {
            console.log(preAccoppiati);
            this.store.dispatch(new SetListaComposizioneVeloce(preAccoppiati));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }


    @Action(SetListaComposizioneVeloce)
    setPreAccoppiati({ patchState }: StateContext<PreAccoppiatiStateModel>, action: SetListaComposizioneVeloce) {
        if (action.boxPartenza) {
            patchState({
                preAccoppiati: action.boxPartenza
            });
        }
    }

    @Action(ClearListaComposizioneVeloce)
    clearListaComposizioneVeloce({ patchState }: StateContext<PreAccoppiatiStateModel>) {
        patchState({
            preAccoppiati: null
        });
    }


    @Action(SelectPreAccoppiatoComposizione)
    selectPreAccoppiatoComposizione({ setState, getState, patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: SelectPreAccoppiatoComposizione) {
        // controllo se il mezzo che è all'interno del preAccoppiato non è prenotato
        if (!action.preAcc.mezzoComposizione.istanteScadenzaSelezione) {
            setState(
                patch({
                    idPreAccoppiatiSelezionati: insertItem(action.preAcc.id),
                    idPreAccoppiatoSelezionato: action.preAcc.id
                })
            );
        } else {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile selezionare il Pre-Accoppiato', 'Il mezzo è già presente in un\'altra partenza'));
        }
        // console.log(action.preAcc);
    }

    @Action(UnselectPreAccoppiatoComposizione)
    unselectPreAccoppiatoComposizione({ setState, patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: UnselectPreAccoppiatoComposizione) {
        setState(
            patch({
                idPreAccoppiatiSelezionati: removeItem(x => x === action.preAcc.id),
                idPreAccoppiatoSelezionato: null
            })
        );
        // console.log(action.preAcc);
    }

    @Action(UpdateMezzoPreAccoppiatoComposizione)
    updateMezzoBoxPartenzaComposizione({ getState, setState, patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: UpdateMezzoPreAccoppiatoComposizione) {
        const state = getState();
        let preAccoppiato = null;
        state.preAccoppiati.forEach((preAcc: BoxPartenza) => {
            if (preAcc.mezzoComposizione.mezzo.codice === action.mezzoComp.mezzo.codice) {
                preAccoppiato = makeCopy(preAcc);
                preAccoppiato.mezzoComposizione = action.mezzoComp;
            }
        });
        setState(
            patch({
                preAccoppiati: updateItem((preAcc: BoxPartenza) => preAcc.mezzoComposizione.mezzo.codice === action.mezzoComp.mezzo.codice, preAccoppiato)
            })
        );
        // console.log(action.preAcc);
    }

    @Action(ClearComposizioneVeloce)
    clearComposizioneVeloce({ patchState }: StateContext<PreAccoppiatiStateModel>) {
        patchState(PreAccoppiatiStateModelStateDefaults);
    }
}
