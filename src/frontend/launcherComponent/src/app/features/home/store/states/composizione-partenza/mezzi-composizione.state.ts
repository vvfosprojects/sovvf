import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import {
    AddBookingMezzoComposizione,
    AddBookMezzoComposizione,
    AddMezzoComposizione,
    ClearListaMezziComposizione, ClearMezzoComposizione,
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
    ReducerSelectMezzoComposizione, SelectMezzoComposizioneFromMappa, SganciamentoMezzoComposizione, UpdateMezzoComposizioneScadenzaByCodiceMezzo
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import {
    AddBoxPartenza,
    SelectBoxPartenza,
    UpdateMezzoBoxPartenza,
    AddMezzoBoxPartenzaSelezionato
} from '../../actions/composizione-partenza/box-partenza.actions';
import { BoxPartenzaState } from './box-partenza.state';
import { GetListeComposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { mezzoComposizioneBusy } from '../../../composizione-partenza/shared/functions/composizione-functions';
import {
    ClearMarkerMezzoHover,
    SetMarkerMezzoHover,
    SetMarkerMezzoSelezionato
} from '../../actions/maps/marker.actions';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Partenza } from 'src/app/shared/model/partenza.model';
import { RichiesteState } from '../richieste/richieste.state';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SganciamentoMezzoModalComponent } from '../../../composizione-partenza/shared/sganciamento-mezzo-modal/sganciamento-mezzo-modal.component';
import { ConfermaPartenze } from '../../../composizione-partenza/interface/conferma-partenze-interface';
import { ComposizionePartenzaState } from './composizione-partenza.state';
import { TurnoState } from 'src/app/features/navbar/store/states/turno/turno.state';
import { ConfirmPartenze } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { makeCopy } from '../../../../../shared/helper/function';
import { SquadreComposizioneState } from './squadre-composizione.state';
import { FilterListaSquadreComposizione, SetListaSquadreComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';

export interface MezziComposizioneStateStateModel {
    mezziComposizione: MezzoComposizione[];
    idMezzoComposizioneSelezionato: string;
    idMezzoComposizioneHover: string;
    idMezzoSelezionato: string;
    idMezziInPrenotazione: string[];
    idMezziPrenotati: string[];
    idMezziBloccati: string[];
}

export const MezziComposizioneStateDefaults: MezziComposizioneStateStateModel = {
    mezziComposizione: null,
    idMezzoComposizioneSelezionato: null,
    idMezzoComposizioneHover: null,
    idMezzoSelezionato: null,
    idMezziPrenotati: [],
    idMezziInPrenotazione: [],
    idMezziBloccati: []
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

    @Selector()
    static idMezzoComposizioneSelezionato(state: MezziComposizioneStateStateModel) {
        return state.idMezzoComposizioneSelezionato;
    }

    @Selector()
    static idMezzoSelezionato(state: MezziComposizioneStateStateModel) {
        return state.idMezzoSelezionato;
    }

    @Selector()
    static idMezziInPrenotazione(state: MezziComposizioneStateStateModel) {
        return state.idMezziInPrenotazione;
    }

    @Selector()
    static idMezziPrenotati(state: MezziComposizioneStateStateModel) {
        return state.idMezziPrenotati;
    }

    @Selector()
    static idMezziBloccati(state: MezziComposizioneStateStateModel) {
        return state.idMezziBloccati;
    }

    @Selector()
    static idMezzoHover(state: MezziComposizioneStateStateModel) {
        return state.idMezzoComposizioneHover;
    }

    constructor(private store: Store,
                private _compPartenzaService: CompPartenzaService,
                private modalService: NgbModal) {
    }

    @Action(SetListaMezziComposizione)
    setListaMezziComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SetListaMezziComposizione) {
        const state = getState();
        patchState({
            mezziComposizione: action.mezziComp
        });
        action.mezziComp.forEach((mezzoComp: MezzoComposizione) => {
            if (mezzoComp.istanteScadenzaSelezione) {
                dispatch(new AddBookMezzoComposizione(mezzoComp.mezzo.codice));
            } else if (state.idMezziPrenotati.indexOf(mezzoComp.mezzo.codice) >= 0 && !mezzoComp.istanteScadenzaSelezione) {
                dispatch(new RemoveBookMezzoComposizione(mezzoComp.mezzo.codice));
            }
        });
    }

    @Action(ClearListaMezziComposizione)
    clearListaMezziComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>) {
        patchState({
            mezziComposizione: null
        });
    }

    @Action(AddMezzoComposizione)
    addMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: AddMezzoComposizione) {
        console.log(action.mezzoComp);
    }

    @Action(RemoveMezzoComposizione)
    removeMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveMezzoComposizione) {
        console.log(action.idMezzoComp);
    }

    @Action(UpdateMezzoComposizione)
    updateMezzoComposizione({ setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: UpdateMezzoComposizione) {
        setState(
            patch({
                mezziComposizione: updateItem<MezzoComposizione>(mezzoComp => mezzoComp.mezzo.codice === action.mezzoComp.mezzo.codice, action.mezzoComp)
            })
        );
        dispatch(new UpdateMezzoBoxPartenza(action.mezzoComp));
        // console.log('Update mezzo composizione', action.mezzoComp);
    }

    @Action(UpdateMezzoComposizioneScadenzaByCodiceMezzo)
    updateMezzoComposizioneScadenzaByCodiceMezzo({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: UpdateMezzoComposizioneScadenzaByCodiceMezzo) {
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
        // console.log('Update mezzo composizione', mezzoComposizione);
    }

    @Action(ReducerSelectMezzoComposizione)
    reducerSelectMezzoComposizione({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione) {
        const state = getState();
        const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);

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
                    dispatch(new SetMarkerMezzoSelezionato(action.mezzoComp.mezzo.codice, true));
                    dispatch(new SelectMezzoComposizione(action.mezzoComp));
                    dispatch(new AddMezzoBoxPartenzaSelezionato(action.mezzoComp));
                }, calcolaTimeout(addBoxPartenza));
            } else if (state.idMezziPrenotati.indexOf(action.mezzoComp.id) !== -1) {
                dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è già presente in un\'altra partenza'));
            } else if (state.idMezziInPrenotazione.indexOf(action.mezzoComp.id) !== -1) {
                dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è in prenotazione da un altro utente'));
            }
        } else {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è ' + action.mezzoComp.mezzo.stato + ' ed è impegnato in un\'altra richiesta'));
        }

        function calcolaTimeout(addBoxPartenza: boolean) {
            let _timeout = 0;
            if (!addBoxPartenza) {
                _timeout = 0;
            } else {
                _timeout = 10;
            }
            return _timeout;
        }
    }

    @Action(SelectMezzoComposizioneFromMappa)
    selectMezzoComposizioneFromMappa({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizioneFromMappa) {
        if (action && action.mezzoId) {
            const mezzoComposizione = getState().mezziComposizione.filter(mezzo => mezzo.mezzo.codice === action.mezzoId);
            if (mezzoComposizione && mezzoComposizione[0]) {
                const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
                if (boxPartenzaList.length === 0) {
                    dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione[0]));
                } else {
                    const mezzoInList = boxPartenzaList.filter(boxPartenza => boxPartenza.mezzoComposizione && boxPartenza.mezzoComposizione.mezzo.codice === action.mezzoId);
                    mezzoInList && mezzoInList[0] ? console.log('Mezzo già selezionato') : dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione[0]));
                }
            } else {
                console.error('id mezzo non trovato');
            }
            // console.log('Mezzo selezionato dalla mappa', action.mezzoId);
        }
    }

    @Action(SelectMezzoComposizione)
    selectMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione) {
        patchState({
            idMezzoComposizioneSelezionato: action.mezzoComp.id,
            idMezzoSelezionato: action.mezzoComp.mezzo.codice
        });
        // console.log('[SelectMezzoComposizione]', action.mezzoComp);

        // verifico se devo ricaricare la lista
        const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
        const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
        const boxPartenzaSelezionato = boxPartenzaList.filter(x => x.id === idBoxPartenzaSelezionato)[0];
        if (boxPartenzaSelezionato && (!boxPartenzaSelezionato.squadraComposizione || boxPartenzaSelezionato.squadraComposizione.length <= 0)) {
            // todo: logica per filtrare le squadre
            console.log('Mezzo Selezionato', action.mezzoComp);
            const allSquadreComposione = this.store.selectSnapshot(SquadreComposizioneState.allSquadreComposione);
            dispatch(new SetListaSquadreComposizione(allSquadreComposione));
            dispatch(new FilterListaSquadreComposizione(action.mezzoComp.mezzo.distaccamento.codice));
            // dispatch(new GetListeComposizioneAvanzata(null, null, true));
        }
    }

    @Action(UnselectMezzoComposizione)
    unselectMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>) {
        patchState({
            idMezzoComposizioneSelezionato: null,
            idMezzoSelezionato: null
        });
    }

    @Action(ClearSelectedMezziComposizione)
    clearSelectedMezziComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>) {
        patchState({
            idMezzoComposizioneSelezionato: null,
            idMezzoSelezionato: null
        });
    }

    @Action(HoverInMezzoComposizione)
    hoverInMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: HoverInMezzoComposizione) {
        patchState({
            idMezzoComposizioneHover: action.idMezzoComp
        });
        dispatch(new SetMarkerMezzoHover(action.idMezzoComp));
    }

    @Action(HoverOutMezzoComposizione)
    hoverOutMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>) {
        patchState({
            idMezzoComposizioneHover: null
        });
        dispatch(new ClearMarkerMezzoHover());
    }

    @Action(RequestBookMezzoComposizione)
    requestBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestBookMezzoComposizione) {
        const mezzoPrenotatoObj = {
            'codiceMezzo': action.mezzoComp.mezzo.codice,
            'codiceRichiesta': this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id
        };
        dispatch(new AddBookingMezzoComposizione(action.mezzoComp));
        this._compPartenzaService.setMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
            if (action.addBoxPartenza) {
                dispatch(new AddBoxPartenza());
            } else if (action.selectBoxPartenza) {
                dispatch(new SelectBoxPartenza(action.selectBoxPartenza));
            }
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore Prenotazione Mezzo', 'Il server web non risponde', 5)));
    }

    @Action(AddBookMezzoComposizione)
    addBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: AddBookMezzoComposizione) {
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
    addBookingMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: AddBookingMezzoComposizione) {
        setState(
            patch({
                idMezziInPrenotazione: insertItem(action.mezzoComp.id)
            })
        );
    }

    @Action(RequestRemoveBookMezzoComposizione)
    requestRemoveBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestRemoveBookMezzoComposizione) {
        const mezzoPrenotatoObj = {
            'codiceMezzo': action.mezzoComp.mezzo.codice,
            'codiceRichiesta': this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id
        };
        this._compPartenzaService.removeMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore Rimozione Prenotazione Mezzo', 'Il server web non risponde', 5)));
    }

    @Action(RemoveBookMezzoComposizione)
    removeBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveBookMezzoComposizione) {
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
    removeBookingMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveBookingMezzoComposizione) {
        setState(
            patch({
                idMezziInPrenotazione: removeItem(id => id === action.codiceMezzo)
            })
        );
    }

    @Action(RequestResetBookMezzoComposizione)
    requestResetBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestResetBookMezzoComposizione) {
        const mezzoPrenotatoObj = {
            'mezzoComposizione': action.mezzoComp
        };
        this._compPartenzaService.setMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore Reset Prenotazione Mezzo', 'Il server web non risponde', 5)));
    }

    @Action(ResetBookMezzoComposizione)
    resetBookMezzoComposizione({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: ResetBookMezzoComposizione) {
        console.log('Reset Mezzo prenotato Object', action.mezzoComp);
    }

    @Action(LockMezzoComposizione)
    lockMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: LockMezzoComposizione) {
        setState(
            patch({
                idMezzoSelezionato: null,
                idMezziBloccati: insertItem(action.idMezzoComp)
            })
        );
    }

    @Action(UnlockMezzoComposizione)
    unlockMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: UnlockMezzoComposizione) {
        setState(
            patch({
                idMezzoSelezionato: null,
                idMezziBloccati: removeItem(id => id === action.idMezzoComp)
            })
        );
    }

    @Action(RequestUnlockMezzoComposizione)
    requestUnlockMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: RequestUnlockMezzoComposizione) {
        console.log(action.idMezzoComp);
    }

    @Action(ClearMezzoComposizione)
    clearMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>) {
        patchState(MezziComposizioneStateDefaults);
    }

    @Action(SganciamentoMezzoComposizione)
    sganciamentoMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: SganciamentoMezzoComposizione) {
        let richiestaDa = {} as SintesiRichiesta;
        let partenzaDaSganciare = {} as Partenza;
        const richiestaById$ = this.store.select(RichiesteState.richiestaById).pipe(map(fn => fn(action.sganciamentoObj.idRichiestaDaSganciare)));

        richiestaById$.subscribe(r => {
            richiestaDa = r;

            // tslint:disable-next-line:max-line-length
            partenzaDaSganciare = richiestaDa.partenzeRichiesta && richiestaDa.partenzeRichiesta.length > 0 ? richiestaDa.partenzeRichiesta.filter(x => x.mezzo.codice === action.sganciamentoObj.idMezzoDaSganciare)[0] : null;
            // console.log('richiestaDa', richiestaDa);
        });

        if (richiestaDa && partenzaDaSganciare) {
            const modalSganciamento = this.modalService.open(SganciamentoMezzoModalComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
            modalSganciamento.componentInstance.icona = { descrizione: 'truck', colore: 'secondary' };
            modalSganciamento.componentInstance.titolo = 'Sganciamento Mezzo';
            modalSganciamento.componentInstance.richiestaDa = richiestaDa;
            modalSganciamento.componentInstance.bottoni = [
                { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
                { type: 'ok', descrizione: 'Sgancia', colore: 'success' },
            ];

            modalSganciamento.result.then(
                (val) => {
                    switch (val) {
                        case 'ok':
                            const partenzaObj: ConfermaPartenze = {
                                partenze: [partenzaDaSganciare],
                                idRichiesta: this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).codice,
                                turno: this.store.selectSnapshot(TurnoState.turnoCalendario).corrente,
                                idRichiestaDaSganciare: action.sganciamentoObj.idRichiestaDaSganciare,
                                idMezzoDaSganciare: action.sganciamentoObj.idMezzoDaSganciare
                            };
                            this.store.dispatch(new ConfirmPartenze(partenzaObj));
                            // console.log('Partenza sganciata', partenzaObj);
                            break;
                        case 'ko':
                            console.warn('Sganciamento Annullato');
                            break;
                    }
                    // console.log('Modal Sganciamento chiusa con val ->', val);
                },
                (err) => console.error('Modal Sganciamento chiusa senza bottoni. Err ->', err)
            );
            console.log('Sganciamento Object', action.sganciamentoObj);
        } else {
            console.error('[SganciamentoMezzo] Errore! richiestaDa / partenzaDaSganciare non presente');
        }
    }

}
