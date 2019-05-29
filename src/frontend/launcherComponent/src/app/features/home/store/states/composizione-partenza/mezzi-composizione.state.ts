import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import {
    AddMezzoComposizione, LockMezzoComposizione,
    RemoveMezzoComposizione, RequestUnlockMezzoComposizione,
    SelectMezzoComposizione,
    SetListaMezziComposizione, UnlockMezzoComposizione, UnselectMezzoComposizione,
    UpdateMezzoComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';

export interface MezziComposizioneStateStateModel {
    mezziComposizione: MezzoComposizione[];
}

export const MezziComposizioneStateDefaults: MezziComposizioneStateStateModel = {
    mezziComposizione: []
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
    selectMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizione) {
        console.log(action.idMezzo);
    }

    @Action(UnselectMezzoComposizione)
    unselectMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: UnselectMezzoComposizione) {
        console.log(action.idMezzo);
    }

    @Action(LockMezzoComposizione)
    lockMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: LockMezzoComposizione) {
        console.log(action.idMezzo);
    }

    @Action(UnlockMezzoComposizione)
    unlockMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: UnlockMezzoComposizione) {
        console.log(action.idMezzo);
    }

    @Action(RequestUnlockMezzoComposizione)
    requestUnlockMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: RequestUnlockMezzoComposizione) {
        console.log(action.idMezzo);
    }
}
