import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MezzoComposizione } from '../../../interface/mezzo-composizione-interface';
import {
    AddBookingMezzoComposizione,
    AddBookMezzoComposizione,
    AddMezzoComposizione,
    ClearListaMezziComposizione,
    ClearMezzoComposizione,
    ClearSelectedMezziComposizione,
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    LockMezzoComposizione,
    RemoveBookingMezzoComposizione,
    RemoveBookMezzoComposizione,
    RemoveMezzoComposizione,
    RequestBookMezzoComposizione,
    RequestRemoveBookMezzoComposizione,
    RequestResetBookMezzoComposizione,
    RequestUnlockMezzoComposizione,
    ResetBookMezzoComposizione,
    SelectMezzoComposizione,
    SetListaMezziComposizione,
    UnlockMezzoComposizione,
    UnselectMezzoComposizione,
    UpdateMezzoComposizione,
    ReducerSelectMezzoComposizione,
    SelectMezzoComposizioneFromMappa,
    SganciamentoMezzoComposizione,
    UpdateMezzoComposizioneScadenzaByCodiceMezzo
} from '../../actions/mezzi-composizione/mezzi-composizione.actions';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';
import { CompPartenzaService } from '../../../../core/service/comp-partenza-service/comp-partenza.service';
import {
    AddBoxPartenza,
    SelectBoxPartenza,
    UpdateMezzoBoxPartenza,
    AddMezzoBoxPartenzaSelezionato
} from '../../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import { calcolaTimeout, mezzoComposizioneBusy } from '../../../helper/composizione-functions';
import {
    ClearMarkerMezzoHover,
    SetMarkerMezzoHover,
    SetMarkerMezzoSelezionato
} from '../../../../features/home/store/actions/maps/marker.actions';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Partenza } from 'src/app/shared/model/partenza.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SganciamentoMezzoModalComponent } from '../../../../features/home/composizione-partenza/shared/sganciamento-mezzo-modal/sganciamento-mezzo-modal.component';
import { ConfermaPartenze } from '../../../../features/home/composizione-partenza/interface/conferma-partenze-interface';
import { TurnoState } from 'src/app/features/navbar/store/states/turno.state';
import { ConfirmPartenze } from '../../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { makeCopy } from '../../../helper/function';
import { SintesiRichiesteService } from '../../../../core/service/lista-richieste-service/lista-richieste.service';
import { SquadreComposizioneState } from '../squadre-composizione/squadre-composizione.state';
import { Injectable } from '@angular/core';
import { GetListeComposizioneAvanzata } from '../../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';

export interface MezziComposizioneStateStateModel {
    allMezziComposizione: MezzoComposizione[];
    mezziComposizione: MezzoComposizione[];
    idMezzoComposizioneSelezionato: string;
    idMezzoComposizioneHover: string;
    idMezzoSelezionato: string;
    idMezziInPrenotazione: string[];
    idMezziPrenotati: string[];
    idMezziBloccati: string[];
}

export const MezziComposizioneStateDefaults: MezziComposizioneStateStateModel = {
    allMezziComposizione: null,
    mezziComposizione: null,
    idMezzoComposizioneSelezionato: null,
    idMezzoComposizioneHover: null,
    idMezzoSelezionato: null,
    idMezziPrenotati: [],
    idMezziInPrenotazione: [],
    idMezziBloccati: []
};

@Injectable()
@State<MezziComposizioneStateStateModel>({
    name: 'mezziComposizione',
    defaults: MezziComposizioneStateDefaults
})
export class MezziComposizioneState {

    @Selector()
    static mezziComposizione(state: MezziComposizioneStateStateModel): MezzoComposizione[] {
        return state.mezziComposizione;
    }

    @Selector()
    static allMezziComposizione(state: MezziComposizioneStateStateModel): MezzoComposizione[] {
        return state.allMezziComposizione;
    }

    @Selector()
    static mezzoSelezionato(state: MezziComposizioneStateStateModel): MezzoComposizione {
        let mezzoSelez = null as MezzoComposizione;
        state.allMezziComposizione.forEach((m: MezzoComposizione) => {
            if (m.id === state.idMezzoSelezionato) {
                mezzoSelez = m;
            }
        });
        return mezzoSelez;
    }

    @Selector()
    static idMezzoComposizioneSelezionato(state: MezziComposizioneStateStateModel): string {
        return state.idMezzoComposizioneSelezionato;
    }

    @Selector()
    static idMezzoSelezionato(state: MezziComposizioneStateStateModel): string {
        return state.idMezzoSelezionato;
    }

    @Selector()
    static idMezziInPrenotazione(state: MezziComposizioneStateStateModel): string[] {
        return state.idMezziInPrenotazione;
    }

    @Selector()
    static idMezziPrenotati(state: MezziComposizioneStateStateModel): string[] {
        return state.idMezziPrenotati;
    }

    @Selector()
    static idMezziBloccati(state: MezziComposizioneStateStateModel): string[] {
        return state.idMezziBloccati;
    }

    @Selector()
    static idMezzoHover(state: MezziComposizioneStateStateModel): string {
        return state.idMezzoComposizioneHover;
    }

    constructor(private store: Store,
                private compPartenzaService: CompPartenzaService,
                private richiesteService: SintesiRichiesteService,
                private modalService: NgbModal) {
    }

    @Action(SetListaMezziComposizione)
    setListaMezziComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SetListaMezziComposizione): void {
        const state = getState();
        const allMezziComposione = action.mezziComp ? action.mezziComp : this.store.selectSnapshot(MezziComposizioneState.allMezziComposizione);
        patchState({
            mezziComposizione: allMezziComposione,
            allMezziComposizione: allMezziComposione
        });
        allMezziComposione.forEach((mezzoComp: MezzoComposizione) => {
            if (mezzoComp.istanteScadenzaSelezione) {
                dispatch(new AddBookMezzoComposizione(mezzoComp.mezzo.codice));
            } else if (state.idMezziPrenotati.indexOf(mezzoComp.mezzo.codice) >= 0 && !mezzoComp.istanteScadenzaSelezione) {
                dispatch(new RemoveBookMezzoComposizione(mezzoComp.mezzo.codice));
            }
        });
    }

    @Action(ClearListaMezziComposizione)
    clearListaMezziComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>): void  {
        patchState({
            mezziComposizione: null,
            allMezziComposizione: null
        });
    }

    @Action(AddMezzoComposizione)
    addMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: AddMezzoComposizione): void  {
        console.log(action.mezzoComp);
    }

    @Action(RemoveMezzoComposizione)
    removeMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveMezzoComposizione): void  {
        console.log(action.idMezzoComp);
    }

    @Action(UpdateMezzoComposizione)
    updateMezzoComposizione({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: UpdateMezzoComposizione): void  {
        const state = getState();
        const mezzoComposizione = state.allMezziComposizione && state.allMezziComposizione.length > 0 ? state.allMezziComposizione.filter((mC: MezzoComposizione) => mC.mezzo.codice === action.mezzo.codice)[0] : null;
        const mezzoComposizioneCopy = mezzoComposizione ? makeCopy(mezzoComposizione) as MezzoComposizione : null;
        if (mezzoComposizione && mezzoComposizioneCopy) {
            mezzoComposizioneCopy.mezzo = action.mezzo;
            setState(
                patch({
                    allMezziComposizione: updateItem<MezzoComposizione>(mezzoComp => mezzoComp.mezzo.codice === action.mezzo.codice, mezzoComposizioneCopy),
                    mezziComposizione: updateItem<MezzoComposizione>(mezzoComp => mezzoComp.mezzo.codice === action.mezzo.codice, mezzoComposizioneCopy)
                })
            );
            dispatch(new UpdateMezzoBoxPartenza(mezzoComposizioneCopy));
        }
    }

    @Action(UpdateMezzoComposizioneScadenzaByCodiceMezzo)
    updateMezzoComposizioneScadenzaByCodiceMezzo({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: UpdateMezzoComposizioneScadenzaByCodiceMezzo): void  {
        const state = getState();
        let mezzoComposizione = state.mezziComposizione.filter(mezzoComp => mezzoComp.mezzo.codice === action.codiceMezzo)[0];
        if (mezzoComposizione) {
            mezzoComposizione = makeCopy(mezzoComposizione);
            mezzoComposizione.istanteScadenzaSelezione = action.istanteScadenzaSelezione;
        }
        setState(
            patch({
                mezziComposizione: updateItem<MezzoComposizione>(mezzoComp => mezzoComp.mezzo.codice === action.codiceMezzo, mezzoComposizione)
            })
        );
        dispatch(new UpdateMezzoBoxPartenza(mezzoComposizione));
    }

    @Action(ReducerSelectMezzoComposizione)
    reducerSelectMezzoComposizione({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione): void  {
        const state = getState();
        const boxPartenzaList = this.store.selectSnapshot(x => x.boxPartenza.boxPartenzaList);

        // controllo se lo stato del mezzo è diverso da "In Viaggio" o "Sul Posto"
        if (!mezzoComposizioneBusy(action.mezzoComp.mezzo.stato)) {
            // controllo se è un mezzo prenotato oppure se è in prenotazione
            if (state.idMezziPrenotati.indexOf(action.mezzoComp.id) === -1 && state.idMezziInPrenotazione.indexOf(action.mezzoComp.id) === -1) {
                let addBoxPartenza = false;
                if (boxPartenzaList.length <= 0) {
                    addBoxPartenza = true;
                    dispatch(new AddBoxPartenza());
                }
                setTimeout(() => {
                    if (!action.mezzoComp.mezzo.coordinateFake) {
                        dispatch(new SetMarkerMezzoSelezionato(action.mezzoComp.mezzo.codice, true));
                    }
                    dispatch(new SelectMezzoComposizione(action.mezzoComp));
                    dispatch(new AddMezzoBoxPartenzaSelezionato(action.mezzoComp));
                }, calcolaTimeout(addBoxPartenza));
            } else if (state.idMezziPrenotati.indexOf(action.mezzoComp.id) !== -1) {
                dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è già presente in un\'altra partenza', null, null, true));
            } else if (state.idMezziInPrenotazione.indexOf(action.mezzoComp.id) !== -1) {
                dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è in prenotazione da un altro utente', null, null, true));
            }
        } else {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è ' + action.mezzoComp.mezzo.stato + ' ed è impegnato in un\'altra richiesta', null, null, true));
        }
    }

    @Action(SelectMezzoComposizioneFromMappa)
    selectMezzoComposizioneFromMappa({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizioneFromMappa): void {
        if (action && action.mezzoId) {
            const mezzoComposizione = getState().mezziComposizione.filter(mezzo => mezzo.mezzo.codice === action.mezzoId);
            if (mezzoComposizione && mezzoComposizione[0]) {
                const boxPartenzaList = this.store.selectSnapshot(x => x.boxPartenza.boxPartenzaList);
                if (boxPartenzaList.length === 0) {
                    dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione[0]));
                } else {
                    const mezzoInList = boxPartenzaList.filter(boxPartenza => boxPartenza.mezzoComposizione && boxPartenza.mezzoComposizione.mezzo.codice === action.mezzoId);
                    mezzoInList && mezzoInList[0] ? console.log('Mezzo già selezionato') : dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione[0]));
                }
            } else {
                console.error('id mezzo non trovato');
            }
        }
    }

    @Action(SelectMezzoComposizione)
    selectMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione): void  {
        patchState({
            idMezzoComposizioneSelezionato: action.mezzoComp.id,
            idMezzoSelezionato: action.mezzoComp.mezzo.codice
        });

        // verifico se devo filtrare la lista
        const idBoxPartenzaSelezionato = this.store.selectSnapshot(x => x.boxPartenza.idBoxPartenzaSelezionato);
        const boxPartenzaList = this.store.selectSnapshot(x => x.boxPartenza.boxPartenzaList);
        const boxPartenzaSelezionato = boxPartenzaList.filter(x => x.id === idBoxPartenzaSelezionato)[0];
        if (boxPartenzaSelezionato && (!boxPartenzaSelezionato.squadraComposizione || boxPartenzaSelezionato.squadraComposizione.length <= 0)) {
            dispatch([
                new GetListeComposizioneAvanzata(),
            ]);
        }
    }

    @Action(UnselectMezzoComposizione)
    unselectMezzoComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>): void  {
        patchState({
            idMezzoComposizioneSelezionato: null,
            idMezzoSelezionato: null
        });

        const idSquadreSelezionate = this.store.selectSnapshot(SquadreComposizioneState.idSquadreSelezionate);
        if (idSquadreSelezionate && idSquadreSelezionate.length <= 0) {
            dispatch([
                new GetListeComposizioneAvanzata(),
            ]);
        }
    }

    @Action(ClearSelectedMezziComposizione)
    clearSelectedMezziComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>): void {
        patchState({
            idMezzoComposizioneSelezionato: null,
            idMezzoSelezionato: null
        });
    }

    @Action(HoverInMezzoComposizione)
    hoverInMezzoComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: HoverInMezzoComposizione): void {
        patchState({
            idMezzoComposizioneHover: action.idMezzoComp
        });
        if (!action.coordinateFake) {
            dispatch(new SetMarkerMezzoHover(action.idMezzoComp));
        }
    }

    @Action(HoverOutMezzoComposizione)
    hoverOutMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>): void {
        patchState({
            idMezzoComposizioneHover: null
        });
        dispatch(new ClearMarkerMezzoHover());
    }

    @Action(RequestBookMezzoComposizione)
    requestBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestBookMezzoComposizione): void {
        const mezzoPrenotatoObj = {
            codiceMezzo: action.mezzoComp.mezzo.codice,
            codiceRichiesta: this.store.selectSnapshot(x => x.composizionePartenza.richiesta).id,
        };
        dispatch(new AddBookingMezzoComposizione(action.mezzoComp));
        this.compPartenzaService.setMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
            if (action.addBoxPartenza) {
                dispatch(new AddBoxPartenza());
            } else if (action.selectBoxPartenza) {
                dispatch(new SelectBoxPartenza(action.selectBoxPartenza));
            }
        });
    }

    @Action(AddBookMezzoComposizione)
    addBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: AddBookMezzoComposizione): void {
        const state = getState();
        const mezzoComp = state.mezziComposizione.length > 0 ? state.mezziComposizione.filter(x => x.mezzo.codice === action.codiceMezzo)[0] : null;
        const idMezzoComp = mezzoComp ? mezzoComp.id : null;
        if (idMezzoComp) {
            if (state.idMezziPrenotati.indexOf(idMezzoComp) === -1) {
                setState(
                    patch({
                        idMezziPrenotati: insertItem(idMezzoComp)
                    })
                );
            }
        }
    }

    @Action(AddBookingMezzoComposizione)
    addBookingMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: AddBookingMezzoComposizione): void {
        setState(
            patch({
                idMezziInPrenotazione: insertItem(action.mezzoComp.id)
            })
        );
    }

    @Action(RequestRemoveBookMezzoComposizione)
    requestRemoveBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestRemoveBookMezzoComposizione): void {
        const mezzoPrenotatoObj = {
            codiceMezzo: action.mezzoComp.mezzo.codice,
            codiceRichiesta: this.store.selectSnapshot(x => x.composizionePartenza.richiesta).id
        };
        this.compPartenzaService.removeMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
        });
    }

    @Action(RemoveBookMezzoComposizione)
    removeBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveBookMezzoComposizione): void {
        const state = getState();
        const mezzoComp = state.mezziComposizione.filter(x => x.mezzo.codice === action.codiceMezzo);
        const idMezzoComp = mezzoComp && mezzoComp.length > 0 ? mezzoComp[0].id : null;
        if (idMezzoComp && state.idMezziPrenotati.indexOf(idMezzoComp) > -1) {
            setState(
                patch({
                    idMezziPrenotati: removeItem(id => id === idMezzoComp)
                })
            );
        }
    }

    @Action(RemoveBookingMezzoComposizione)
    removeBookingMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveBookingMezzoComposizione): void {
        setState(
            patch({
                idMezziInPrenotazione: removeItem(id => id === action.codiceMezzo)
            })
        );
    }

    @Action(RequestResetBookMezzoComposizione)
    requestResetBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestResetBookMezzoComposizione): void {
        const mezzoPrenotatoObj = {
            mezzoComposizione: action.mezzoComp
        };
        this.compPartenzaService.setMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
        });
    }

    @Action(ResetBookMezzoComposizione)
    resetBookMezzoComposizione({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: ResetBookMezzoComposizione): void {
        console.log('Reset Mezzo prenotato Object', action.mezzoComp);
    }

    @Action(LockMezzoComposizione)
    lockMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: LockMezzoComposizione): void {
        setState(
            patch({
                idMezzoSelezionato: null,
                idMezziBloccati: insertItem(action.idMezzoComp)
            })
        );
    }

    @Action(UnlockMezzoComposizione)
    unlockMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: UnlockMezzoComposizione): void {
        setState(
            patch({
                idMezzoSelezionato: null,
                idMezziBloccati: removeItem(id => id === action.idMezzoComp)
            })
        );
    }

    @Action(RequestUnlockMezzoComposizione)
    requestUnlockMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: RequestUnlockMezzoComposizione): void {
        console.log(action.idMezzoComp);
    }

    @Action(ClearMezzoComposizione)
    clearMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>): void {
        patchState(MezziComposizioneStateDefaults);
    }

    @Action(SganciamentoMezzoComposizione)
    sganciamentoMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SganciamentoMezzoComposizione): void {
        let partenzaDaSganciare = {} as Partenza;
        this.richiesteService.getRichiestaById(action.sganciamentoObj.idRichiestaDaSganciare).subscribe((richiestaDa: SintesiRichiesta) => {
            partenzaDaSganciare = richiestaDa.partenzeRichiesta && richiestaDa.partenzeRichiesta.length > 0 ? richiestaDa.partenzeRichiesta.filter(x => x.mezzo.codice === action.sganciamentoObj.idMezzoDaSganciare)[0] : null;
            if (richiestaDa && partenzaDaSganciare) {
                const modalSganciamento = this.modalService.open(SganciamentoMezzoModalComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
                modalSganciamento.componentInstance.icona = { descrizione: 'truck', colore: 'secondary' };
                modalSganciamento.componentInstance.titolo = 'Sganciamento Mezzo';
                modalSganciamento.componentInstance.richiestaDa = richiestaDa;
                modalSganciamento.componentInstance.idDaSganciare = action.sganciamentoObj.descrizione;
                modalSganciamento.componentInstance.bottoni = [
                    { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
                    { type: 'ok', descrizione: 'Sgancia', colore: 'success' },
                ];

                modalSganciamento.result.then((val) => {
                    switch (val) {
                        case 'ok':
                            const partenzaObj: ConfermaPartenze = {
                                partenze: [partenzaDaSganciare],
                                idRichiesta: this.store.selectSnapshot(x => x.composizionePartenza.richiesta).codice,
                                turno: this.store.selectSnapshot(TurnoState.turnoCalendario).corrente,
                                idRichiestaDaSganciare: action.sganciamentoObj.idRichiestaDaSganciare,
                                idMezzoDaSganciare: action.sganciamentoObj.idMezzoDaSganciare
                            };
                            this.store.dispatch(new ConfirmPartenze(partenzaObj));
                            break;
                        case 'ko':
                            return;
                    }
                });
            }
        });
    }
}
