import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import {
    AddBookMezzoComposizione,
    AddMezzoComposizione, ClearListaMezziComposizione, ClearSelectedMezziComposizione, HoverInMezzoComposizione, HoverOutMezzoComposizione, LockMezzoComposizione, RemoveBookMezzoComposizione,
    RemoveMezzoComposizione, RequestBookMezzoComposizione, RequestRemoveBookMezzoComposizione, RequestResetBookMezzoComposizione, RequestUnlockMezzoComposizione, ResetBookMezzoComposizione,
    SelectMezzoComposizione,
    SetListaMezziComposizione, UnlockMezzoComposizione, UnselectMezzoComposizione,
    UpdateMezzoComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import { AddBoxPartenza, RemoveBoxPartenza, RemoveBoxPartenzaByMezzoId, SelectBoxPartenza, UpdateMezzoBoxPartenza } from '../../actions/composizione-partenza/box-partenza.actions';
import { BoxPartenzaState } from './box-partenza.state';

export interface MezziComposizioneStateStateModel {
    mezziComposizione: MezzoComposizione[];
    idMezzoComposizioneSelezionato: string;
    idMezzoComposizioneHover: string;
    idMezzoSelezionato: string;
    idMezziPrenotati: string[];
    idMezziBloccati: string[];
}

export const MezziComposizioneStateDefaults: MezziComposizioneStateStateModel = {
    mezziComposizione: [],
    idMezzoComposizioneSelezionato: null,
    idMezzoComposizioneHover: null,
    idMezzoSelezionato: null,
    idMezziPrenotati: [],
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
    static idMezzoSelezionato(state: MezziComposizioneStateStateModel) {
        return state.idMezzoComposizioneSelezionato;
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
        console.log('Update mezzo composizione', action.mezzoComp);
    }

    @Action(SelectMezzoComposizione)
    selectMezzoComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione) {
        patchState({
            idMezzoComposizioneSelezionato: action.mezzoComp.id,
            idMezzoSelezionato: action.mezzoComp.mezzo.codice
        });
        // dispatch(new SelectMezzo(action.mezzoComp.mezzo.codice));
        // console.log(action.mezzo);
    }

    @Action(UnselectMezzoComposizione)
    unselectMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: UnselectMezzoComposizione) {
        patchState({
            idMezzoComposizioneSelezionato: null,
            idMezzoSelezionato: null
        });
        // dispatch(new UnselectMezzo(action.mezzoComp.mezzo.codice));
        // console.log(action.mezzo);
    }

    @Action(ClearSelectedMezziComposizione)
    clearSelectedMezziComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>) {
        const state = getState();
        patchState({
            ...state,
            idMezzoComposizioneSelezionato: null
        });
    }

    @Action(HoverInMezzoComposizione)
    hoverInMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: HoverInMezzoComposizione) {
        const state = getState();
        patchState({
            ...state,
            idMezzoComposizioneHover: action.idMezzoComp
        });
        // console.log(action.idMezzoComp);
    }

    @Action(HoverOutMezzoComposizione)
    hoverOutMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: HoverOutMezzoComposizione) {
        const state = getState();
        patchState({
            ...state,
            idMezzoComposizioneHover: null
        });
        // console.log(action.mezzoComp);
    }

    @Action(RequestBookMezzoComposizione)
    requestBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestBookMezzoComposizione) {
        const mezzoPrenotatoObj = {
            'mezzoComposizione': action.mezzoComp
        };
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
        const mezzoComp = state.mezziComposizione.filter(x => x.mezzo.codice === action.mezzoComp.mezzo.codice)[0];
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

    @Action(RequestRemoveBookMezzoComposizione)
    requestRemoveBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: RequestRemoveBookMezzoComposizione) {
        const mezzoPrenotatoObj = {
            'mezzoComposizione': action.mezzoComp
        };
        this._compPartenzaService.removeMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
            // rimuovo il boxPartenza
            // TODO: verificare se serve (backend)
            // if (action.boxPartenza) {
            //     dispatch(new RemoveBoxPartenza(action.boxPartenza));
            //     const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
            //     if (idBoxPartenzaSelezionato === action.boxPartenza.id) {
            //         dispatch(new UnselectMezzoComposizione(action.mezzoComp));
            //     }
            // }
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore Rimozione Prenotazione Mezzo', 'Il server web non risponde', 5)));
    }

    @Action(RemoveBookMezzoComposizione)
    removeBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveBookMezzoComposizione) {
        const state = getState();
        const mezzoComp = state.mezziComposizione.filter(x => x.mezzo.codice === action.mezzoComp.mezzo.codice)[0];
        const idMezzoComp = mezzoComp ? mezzoComp.id : null;
        if (idMezzoComp && state.idMezziPrenotati.indexOf(idMezzoComp) > -1) {
            setState(
                patch({
                    idMezziPrenotati: removeItem(id => id === idMezzoComp)
                })
            );
        }
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
}
