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
    ReducerSelectMezzoComposizione, SelectMezzoComposizioneFromMappa
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
    mezziComposizione: [],
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
                private _compPartenzaService: CompPartenzaService) {
    }

    @Action(SetListaMezziComposizione)
    setListaMezziComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SetListaMezziComposizione) {
        const state = getState();
        patchState({
            mezziComposizione: action.mezziComp
        });
        action.mezziComp.forEach((mezzoComp: MezzoComposizione) => {
            if (mezzoComp.istanteScadenzaSelezione) {
                dispatch(new AddBookMezzoComposizione(mezzoComp));
            } else if (state.idMezziPrenotati.indexOf(mezzoComp.id) >= 0) {
                dispatch(new RemoveBookMezzoComposizione(mezzoComp));
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
        // dispatch(new AddBookMezzoComposizione(action.mezzoComp));
        // console.log('Update mezzo composizione', action.mezzoComp);
    }

    @Action(ReducerSelectMezzoComposizione)
    reducerSelectMezzoComposizione({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione) {
        const state = getState();
        const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
        const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);

        // controllo se lo stato del mezzo è diverso da "In Viaggio" o "Sul Posto"
        if (!mezzoComposizioneBusy(action.mezzoComp.mezzo.stato)) {
            // controllo se è un mezzo prenotato oppure se è in prenotazione
            if (state.idMezziPrenotati.indexOf(action.mezzoComp.id) === -1 && state.idMezziInPrenotazione.indexOf(action.mezzoComp.id) === -1) {
                let addBoxPartenza = false;
                if (boxPartenzaList.length <= 0) {
                    addBoxPartenza = true;
                    this.store.dispatch(new AddBoxPartenza());
                }
                setTimeout(() => {
                    this.store.dispatch(new SelectMezzoComposizione(action.mezzoComp));
                    const boxPartenzaSelezionato = boxPartenzaList.filter(x => x.id === idBoxPartenzaSelezionato)[0];
                    if (boxPartenzaSelezionato && (!boxPartenzaSelezionato.squadraComposizione || boxPartenzaSelezionato.squadraComposizione.length <= 0)) {
                        this.store.dispatch(new GetListeComposizioneAvanzata(null, null, true));
                    }
                    this.store.dispatch(new AddMezzoBoxPartenzaSelezionato(action.mezzoComp));
                }, calcolaTimeout(addBoxPartenza));
            } else if (state.idMezziPrenotati.indexOf(action.mezzoComp.id) !== -1) {
                this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è già presente in un\'altra partenza'));
            } else if (state.idMezziInPrenotazione.indexOf(action.mezzoComp.id) !== -1) {
                this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è in prenotazione da un altro utente'));
            }
        } else {
            this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è ' + action.mezzoComp.mezzo.stato + ' ed è impegnato in un\'altra richiesta'));
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
            // console.log('selectMezzoComposizioneFromMappa', action.mezzoId);
            const mezzoComposizione = getState().mezziComposizione.filter(mezzo => mezzo.mezzo.codice === action.mezzoId);
            if (mezzoComposizione && mezzoComposizione[0]) {
                const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
                if (boxPartenzaList.length === 0) {
                    dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione[0]));
                } else {
                    const mezzoInList = boxPartenzaList.filter( boxPartenza => boxPartenza.mezzoComposizione.mezzo.codice === action.mezzoId);
                    mezzoInList && mezzoInList[0] ? console.log('Mezzo già selezionato') : dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione[0]));
                }
            } else {
                console.error('id mezzo non trovato');
            }
        }
    }

    @Action(SelectMezzoComposizione)
    selectMezzoComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione) {
        patchState({
            idMezzoComposizioneSelezionato: action.mezzoComp.id,
            idMezzoSelezionato: action.mezzoComp.mezzo.codice
        });
        // dispatch(new SelectMezzo(action.mezzoComp.mezzo.codice));
        console.log('[SelectMezzoComposizione]', action.mezzoComp);
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
    hoverInMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: HoverInMezzoComposizione) {
        patchState({
            idMezzoComposizioneHover: action.idMezzoComp
        });
    }

    @Action(HoverOutMezzoComposizione)
    hoverOutMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>) {
        patchState({
            idMezzoComposizioneHover: null
        });
    }

    @Action(RequestBookMezzoComposizione)
    requestBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestBookMezzoComposizione) {
        const mezzoPrenotatoObj = {
            'mezzoComposizione': action.mezzoComp
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
    addBookMezzoComposizione({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: AddBookMezzoComposizione) {
        const state = getState();
        const mezzoComp = state.mezziComposizione.length > 0 ? state.mezziComposizione.filter(x => x.mezzo.codice === action.mezzoComp.mezzo.codice)[0] : null;
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
    addBookingMezzoComposizione({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: AddBookingMezzoComposizione) {
        setState(
            patch({
                idMezziInPrenotazione: insertItem(action.mezzoComp.id)
            })
        );
    }

    @Action(RequestRemoveBookMezzoComposizione)
    requestRemoveBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestRemoveBookMezzoComposizione) {
        const mezzoPrenotatoObj = {
            'mezzoComposizione': action.mezzoComp
        };
        this._compPartenzaService.removeMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore Rimozione Prenotazione Mezzo', 'Il server web non risponde', 5)));
    }

    @Action(RemoveBookMezzoComposizione)
    removeBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveBookMezzoComposizione) {
        const state = getState();
        const mezzoComp = state.mezziComposizione.filter(x => x.mezzo.codice === action.mezzoComp.mezzo.codice);
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
                idMezziInPrenotazione: removeItem(id => id === action.mezzoComp.id)
            })
        );
    }

    @Action(RequestResetBookMezzoComposizione)
    requestResetBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestResetBookMezzoComposizione) {
        const mezzoPrenotatoObj = {
            'mezzoComposizione': action.mezzoComp
        };
        this._compPartenzaService.resetMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
            // dispatch(new AddBoxPartenza());
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
        // TODO: inserire chiamata a controller che richiederà lo sblocco del mezzo rispondendo nel service di SignalR.
        console.log(action.idMezzoComp);
    }

    @Action(ClearMezzoComposizione)
    clearMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>) {
        patchState(MezziComposizioneStateDefaults);
    }

}
