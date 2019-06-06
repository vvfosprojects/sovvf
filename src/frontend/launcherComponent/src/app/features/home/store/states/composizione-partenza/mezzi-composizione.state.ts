import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import {
    AddBookMezzoComposizione,
    AddMezzoComposizione, ClearSelectedMezziComposizione, HoverInMezzoComposizione, HoverOutMezzoComposizione, LockMezzoComposizione, RemoveBookMezzoComposizione,
    RemoveMezzoComposizione, RequestUnlockMezzoComposizione,
    SelectMezzoComposizione,
    SetListaMezziComposizione, StartTimeoutMezzoComposizione, StopTimeoutMezzoComposizione, UnlockMezzoComposizione, UnselectMezzoComposizione,
    UpdateMezzoComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';

export interface MezziComposizioneStateStateModel {
    mezziComposizione: MezzoComposizione[];
    idMezzoSelezionato: string;
    idMezzoHover: string;
    idMezziPrenotati: string[];
    idMezziBloccati: string[];
}

export const MezziComposizioneStateDefaults: MezziComposizioneStateStateModel = {
    mezziComposizione: [],
    idMezzoSelezionato: null,
    idMezzoHover: null,
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
        return state.idMezzoSelezionato;
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
        return state.idMezzoHover;
    }

    constructor() {
    }

    @Action(SetListaMezziComposizione)
    setListaMezziComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: SetListaMezziComposizione) {
        patchState({
            mezziComposizione: action.mezziComposizione
        });
    }

    @Action(AddMezzoComposizione)
    addMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: AddMezzoComposizione) {
        console.log(action.mezzo);
    }

    @Action(RemoveMezzoComposizione)
    removeMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveMezzoComposizione) {
        console.log(action.idMezzo);
    }

    @Action(UpdateMezzoComposizione)
    updateMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: UpdateMezzoComposizione) {
        console.log(action.mezzo);
    }

    @Action(SelectMezzoComposizione)
    selectMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione) {
        const state = getState();
        patchState({
            ...state,
            idMezzoSelezionato: action.idMezzo
        });
        // console.log(action.idMezzo);
    }

    @Action(UnselectMezzoComposizione)
    unselectMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: UnselectMezzoComposizione) {
        const state = getState();
        patchState({
            ...state,
            idMezzoSelezionato: null
        });
        // console.log(action.mezzoComp);
    }

    @Action(ClearSelectedMezziComposizione)
    clearSelectedMezziComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>) {
        const state = getState();
        patchState({
            ...state,
            idMezzoSelezionato: null
        });
    }

    @Action(HoverInMezzoComposizione)
    hoverInMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: HoverInMezzoComposizione) {
        const state = getState();
        patchState({
            ...state,
            idMezzoHover: action.idMezzo
        });
        // console.log(action.idMezzo);
    }

    @Action(HoverOutMezzoComposizione)
    hoverOutMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: HoverOutMezzoComposizione) {
        const state = getState();
        patchState({
            ...state,
            idMezzoHover: null
        });
        // console.log(action.mezzoComp);
    }

    @Action(AddBookMezzoComposizione)
    addBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: AddBookMezzoComposizione) {
        const state = getState();
        if (state.idMezziPrenotati.indexOf(action.idMezzo) === -1) {
            setState(
                patch({
                    idMezziPrenotati: insertItem(action.idMezzo)
                })
            );
        }
        // console.log(action.mezzoComp);
    }

    @Action(RemoveBookMezzoComposizione)
    removeBookMezzoComposizione({ getState, setState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveBookMezzoComposizione) {
        const state = getState();
        if (state.idMezziPrenotati.indexOf(action.idMezzo) > -1) {
            setState(
                patch({
                    idMezziPrenotati: removeItem(id => id === action.idMezzo)
                })
            );
        }
        // console.log(action.mezzoComp);
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
                idMezziBloccati: insertItem(action.idMezzo)
            })
        );
        // console.log(action.idMezzo);
    }

    @Action(UnlockMezzoComposizione)
    unlockMezzoComposizione({ setState }: StateContext<MezziComposizioneStateStateModel>, action: UnlockMezzoComposizione) {
        setState(
            patch({
                idMezzoSelezionato: null,
                idMezziBloccati: removeItem(id => id === action.idMezzo)
            })
        );
        // console.log(action.idMezzo);
    }

    @Action(RequestUnlockMezzoComposizione)
    requestUnlockMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: RequestUnlockMezzoComposizione) {
        // TODO: inserire chiamata a controller che richiederà lo sblocco del mezzo rispondendo nel service di SignalR.
        console.log(action.idMezzo);
    }
}
