import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import {
    AddBookMezzoComposizione,
    AddMezzoComposizione, ClearSelectedMezziComposizione, HoverInMezzoComposizione, HoverOutMezzoComposizione, LockMezzoComposizione, RemoveBookMezzoComposizione,
    RemoveMezzoComposizione, RequestBookMezzoComposizione, RequestUnlockMezzoComposizione, SelectMezzo,
    SelectMezzoComposizione,
    SetListaMezziComposizione, StartTimeoutMezzoComposizione, StopTimeoutMezzoComposizione, UnlockMezzoComposizione, UnselectMezzo, UnselectMezzoComposizione,
    UpdateMezzoComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { BoxPartenzaState } from './box-partenza.state';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import { AddBoxPartenza } from '../../actions/composizione-partenza/box-partenza.actions';
import { ComposizionePartenzaState } from './composizione-partenza-state';

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
                dispatch(new AddBookMezzoComposizione(mezzoComp.mezzo.codice));
            } else if (state.idMezziPrenotati.indexOf(mezzoComp.id) >= 0) {
                dispatch(new RemoveBookMezzoComposizione(mezzoComp.mezzo.codice));
            }
        });
    }

    @Action(AddMezzoComposizione)
    addMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: AddMezzoComposizione) {
        console.log(action.mezzoComp);
    }

    @Action(RemoveMezzoComposizione)
    removeMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveMezzoComposizione) {
        console.log(action.idMezzoComp);
    }

    @Action(UpdateMezzoComposizione)
    updateMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: UpdateMezzoComposizione) {
        setState(
            patch({
                mezziComposizione: updateItem<MezzoComposizione>(mezzo => mezzo.id === action.mezzoComp.id, action.mezzoComp)
            })
        );
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

    @Action(SelectMezzo)
    selectMezzo({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzo) {
        patchState({
            idMezzoSelezionato: action.codiceMezzo
        });
        // console.log(action.idMezzo);
    }

    @Action(UnselectMezzo)
    unselectMezzo({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: UnselectMezzo) {
        patchState({
            idMezzoSelezionato: null
        });
        // console.log(action.mezzoComp);
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
    requestBookMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>) {
        const boxPartenzaState = this.store.selectSnapshot(BoxPartenzaState);
        if (boxPartenzaState.boxPartenzaList.length > 0) {
            boxPartenzaState.boxPartenzaList.forEach((box: BoxPartenza) => {
                if (box.id === boxPartenzaState.idBoxPartenzaSelezionato && box.mezzoComposizione) {
                    // Creazione oggetto Mezzo Prenotato di tipo "MezzoPrenotatoInterface"
                    const idRichiesta = this.store.selectSnapshot(ComposizionePartenzaState).richiesta.id;
                    const idMezzoComposizione = box.mezzoComposizione.mezzo.codice;
                    const mezzoPrenotatoObj = {
                        'idMezzoComposizione': idMezzoComposizione,
                        'idRichiesta': idRichiesta
                    };
                    // console.log('Mezzo Prenotato Object', mezzoPrenotatoObj);
                    this._compPartenzaService.setMezzoPrenotato(mezzoPrenotatoObj).subscribe(() => {
                        dispatch(new AddBoxPartenza());
                    }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore Blocco Mezzo', 'Il server web non risponde', 5)));
                }
            });
        }
    }

    @Action(AddBookMezzoComposizione)
    addBookMezzoComposizione({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: AddBookMezzoComposizione) {
        const state = getState();
        let idMezzoComp = null;
        state.mezziComposizione.forEach((mezzoComp: MezzoComposizione) => {
            if (mezzoComp.mezzo.codice === action.codiceMezzo) {
                idMezzoComp = mezzoComp.id;
            }
        });
        if (state.idMezziPrenotati.indexOf(idMezzoComp) === -1) {
            setState(
                patch({
                    idMezziPrenotati: insertItem(idMezzoComp)
                })
            );
        }
        // console.log(action.codiceMezzo);
    }

    @Action(RemoveBookMezzoComposizione)
    removeBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveBookMezzoComposizione) {
        const state = getState();
        let idMezzoComp = null;
        state.mezziComposizione.forEach((mezzoComp: MezzoComposizione) => {
            if (mezzoComp.mezzo.codice === action.codiceMezzo) {
                idMezzoComp = mezzoComp.id;
            }
        });
        if (state.idMezziPrenotati.indexOf(idMezzoComp) > -1) {
            setState(
                patch({
                    idMezziPrenotati: removeItem(id => id === idMezzoComp)
                })
            );
        }
        // console.log(action.codiceMezzo);
    }

    @Action(StartTimeoutMezzoComposizione)
    startTimeoutMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: StartTimeoutMezzoComposizione) {
        const state = getState();
        // console.log(action.mezzoComp);
    }

    @Action(StopTimeoutMezzoComposizione)
    stopTimeoutMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: StopTimeoutMezzoComposizione) {
        const state = getState();
        // console.log(action.mezzoComp);
    }

    @Action(LockMezzoComposizione)
    lockMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: LockMezzoComposizione) {
        setState(
            patch({
                idMezzoSelezionato: null,
                idMezziBloccati: insertItem(action.idMezzoComp)
            })
        );
        // console.log(action.idMezzo);
    }

    @Action(UnlockMezzoComposizione)
    unlockMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: UnlockMezzoComposizione) {
        setState(
            patch({
                idMezzoSelezionato: null,
                idMezziBloccati: removeItem(id => id === action.idMezzoComp)
            })
        );
        // console.log(action.idMezzo);
    }

    @Action(RequestUnlockMezzoComposizione)
    requestUnlockMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: RequestUnlockMezzoComposizione) {
        // TODO: inserire chiamata a controller che richiederà lo sblocco del mezzo rispondendo nel service di SignalR.
        console.log(action.idMezzoComp);
    }
}
