import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    ClearComposizioneVeloce,
    ClearPreaccoppiati,
    GetListaComposizioneVeloce,
    SelectPreAccoppiatoComposizione,
    SetListaPreaccoppiati,
    UnselectPreAccoppiatoComposizione,
    UpdateMezzoPreAccoppiatoComposizione,
    ClearPreAccoppiatiSelezionatiComposizione,
    HoverInPreAccoppiatoComposizione,
    HoverOutPreAccoppiatoComposizione,
    SetIdPreAccoppiatiOccupati
} from '../../actions/composizione-partenza/composizione-veloce.actions';
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { makeCopy } from '../../../../../shared/helper/function';
import { ClearMarkerMezzoHover, SetMarkerMezzoHover } from '../../actions/maps/marker.actions';
import { checkSquadraOccupata, mezzoComposizioneBusy } from '../../../../../shared/helper/composizione-functions';
import { Injectable } from '@angular/core';
import { PaginationComposizionePartenzaState } from '../../../../../shared/store/states/pagination-composizione-partenza/pagination-composizione-partenza.state';
import { ComposizionePartenzaState } from './composizione-partenza.state';
import { FiltriComposizioneState } from '../../../../../shared/store/states/filtri-composizione/filtri-composizione.state';
import { FiltriComposizione } from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';
import { ListaComposizioneVeloce } from '../../../../../shared/interface/lista-composizione-veloce-interface';

export interface ComposizioneVeloceStateModel {
    allPreAccoppiati: BoxPartenza[];
    preAccoppiati: BoxPartenza[];
    idPreAccoppiatoSelezionato: string;
    idPreAccoppiatiSelezionati: string[];
    idPreAccoppiatiOccupati: string[];
    idPreaccoppiatoHover: string;
}

export const ComposizioneVeloceStateDefaults: ComposizioneVeloceStateModel = {
    allPreAccoppiati: null,
    preAccoppiati: null,
    idPreAccoppiatoSelezionato: null,
    idPreAccoppiatiSelezionati: [],
    idPreAccoppiatiOccupati: [],
    idPreaccoppiatoHover: null
};

@Injectable()
@State<ComposizioneVeloceStateModel>({
    name: 'composizioneVeloce',
    defaults: ComposizioneVeloceStateDefaults
})
export class ComposizioneVeloceState {

    @Selector()
    static preAccoppiati(state: ComposizioneVeloceStateModel): BoxPartenza[] {
        return state.preAccoppiati;
    }

    @Selector()
    static idPreAccoppiatiSelezionati(state: ComposizioneVeloceStateModel): string[] {
        return state.idPreAccoppiatiSelezionati;
    }

    @Selector()
    static idPreAccoppiatiOccupati(state: ComposizioneVeloceStateModel): string[] {
        return state.idPreAccoppiatiOccupati;
    }

    @Selector()
    static idPreAccoppiatoSelezionato(state: ComposizioneVeloceStateModel): string {
        return state.idPreAccoppiatoSelezionato;
    }

    @Selector()
    static idPreAccoppiatoHover(state: ComposizioneVeloceStateModel): string {
        return state.idPreaccoppiatoHover;
    }

    constructor(private compPartenzaService: CompPartenzaService,
                private store: Store) {
    }

    @Action(GetListaComposizioneVeloce)
    getListaPreAccoppiati({ dispatch }: StateContext<ComposizioneVeloceStateModel>, action: GetListaComposizioneVeloce): void {
        const paginationPreaccoppiati = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationMezzi);
        const obj = {
            idRichiesta: this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione) ? this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id : null,
            pagination: {
                page: action.options && action.options.page && action.options.page ? action.options.page : paginationPreaccoppiati.page,
                pageSize: paginationPreaccoppiati.pageSize
            },
            codiceDistaccamento: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento : null,
            statoMezzo: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo : null,
            tipoMezzo: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo : null,
        } as FiltriComposizione;
        this.compPartenzaService.getListaComposizioneVeloce(obj).subscribe((response: ListaComposizioneVeloce) => {
            const preaccoppiatiOccupati = [];
            response.composizionePreaccoppiatiDataArray.forEach((preaccoppiato: BoxPartenza) => {
                if (mezzoComposizioneBusy(preaccoppiato.mezzoComposizione.mezzo.stato) || checkSquadraOccupata(preaccoppiato.squadreComposizione)) {
                    preaccoppiatiOccupati.push(preaccoppiato.id);
                }
            });
            dispatch([
                new SetListaPreaccoppiati(response.composizionePreaccoppiatiDataArray),
                new SetIdPreAccoppiatiOccupati(preaccoppiatiOccupati)
            ]);
        });
    }

    @Action(SetListaPreaccoppiati)
    setListaPreaccoppiati({ getState, patchState, dispatch }: StateContext<ComposizioneVeloceStateModel>, action: SetListaPreaccoppiati): void {
        if (action.preAccoppiati) {
            patchState({
                preAccoppiati: action.preAccoppiati,
                allPreAccoppiati: action.preAccoppiati
            });
        }
    }

    @Action(ClearPreaccoppiati)
    clearPreaccoppiati({ patchState }: StateContext<ComposizioneVeloceStateModel>): void {
        patchState({
            preAccoppiati: null,
            allPreAccoppiati: null
        });
    }


    @Action(SelectPreAccoppiatoComposizione)
    selectPreAccoppiatoComposizione({ setState, getState, patchState, dispatch }: StateContext<ComposizioneVeloceStateModel>, action: SelectPreAccoppiatoComposizione): void {
        // controllo se il mezzo che è all'interno del preAccoppiato non è prenotato
        if (!action.preAcc.mezzoComposizione.istanteScadenzaSelezione) {
            setState(
                patch({
                    idPreAccoppiatiSelezionati: insertItem(action.preAcc.id),
                    idPreAccoppiatoSelezionato: action.preAcc.id
                })
            );
        } else {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile selezionare il PreAccoppiato', 'Il mezzo è già presente in un\'altra partenza', null, null, true));
        }
    }

    @Action(UnselectPreAccoppiatoComposizione)
    unselectPreAccoppiatoComposizione({ setState, patchState, dispatch }: StateContext<ComposizioneVeloceStateModel>, action: UnselectPreAccoppiatoComposizione): void {
        setState(
            patch({
                idPreAccoppiatiSelezionati: removeItem(x => x === action.preAcc.id),
                idPreAccoppiatoSelezionato: null
            })
        );
    }

    @Action(ClearPreAccoppiatiSelezionatiComposizione)
    clearPreAccoppiatiSelezionatiComposizione({ patchState }: StateContext<ComposizioneVeloceStateModel>): void {
        patchState({
                idPreAccoppiatiSelezionati: ComposizioneVeloceStateDefaults.idPreAccoppiatiSelezionati,
                idPreAccoppiatoSelezionato: ComposizioneVeloceStateDefaults.idPreAccoppiatoSelezionato
            }
        );
    }

    @Action(UpdateMezzoPreAccoppiatoComposizione)
    updateMezzoBoxPartenzaComposizione({ getState, setState, patchState, dispatch }: StateContext<ComposizioneVeloceStateModel>, action: UpdateMezzoPreAccoppiatoComposizione): void {
        const state = getState();
        let preAccoppiato = null;
        state.preAccoppiati.forEach((preAcc: BoxPartenza) => {
            if (preAcc.mezzoComposizione.mezzo.codice === action.codiceMezzo) {
                preAccoppiato = makeCopy(preAcc);
                preAccoppiato.mezzoComposizione = action.codiceMezzo;
            }
        });
        setState(
            patch({
                preAccoppiati: updateItem((preAcc: BoxPartenza) => preAcc.mezzoComposizione.mezzo.codice === action.codiceMezzo, preAccoppiato)
            })
        );
    }

    @Action(ClearComposizioneVeloce)
    clearComposizioneVeloce({ patchState }: StateContext<ComposizioneVeloceStateModel>): void {
        patchState(ComposizioneVeloceStateDefaults);
    }

    @Action(SetIdPreAccoppiatiOccupati)
    setIdPreAccoppiatiOccupati({ patchState }: StateContext<ComposizioneVeloceStateModel>, action: SetIdPreAccoppiatiOccupati): void {
        if (action && action.idPreaccoppiatiOccupati) {
            patchState({
                idPreAccoppiatiOccupati: action.idPreaccoppiatiOccupati
            });
        }
    }

    @Action(HoverInPreAccoppiatoComposizione)
    hoverInPreAccoppiatoComposizione({ getState, patchState, dispatch }: StateContext<ComposizioneVeloceStateModel>, action: HoverInPreAccoppiatoComposizione): void {
        const state = getState();
        patchState({
            idPreaccoppiatoHover: action.idBoxPartenzaHover.idBoxPartenza
        });
        if (!state.idPreAccoppiatiOccupati.includes(action.idBoxPartenzaHover.idBoxPartenza)) {
            dispatch(new SetMarkerMezzoHover(action.idBoxPartenzaHover.idMezzo));
        }
    }

    @Action(HoverOutPreAccoppiatoComposizione)
    hoverOutPreAccoppiatoComposizione({ patchState, dispatch }: StateContext<ComposizioneVeloceStateModel>): void {
        patchState({
            idPreaccoppiatoHover: null
        });
        dispatch(new ClearMarkerMezzoHover());
    }
}
