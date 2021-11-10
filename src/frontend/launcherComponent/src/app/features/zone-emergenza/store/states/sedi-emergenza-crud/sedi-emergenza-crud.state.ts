import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ItemSediEmergenzaData } from '../../../interface/item-sedi-emergenza-data.interface';
import {
    AddSediEmergenza,
    AddSediEmergenzaData,
    ClearStateSediEmergenzaCrud,
    DeleteSediEmergenza,
    DeleteSediEmergenzaData,
    ResetSediEmergenza,
    SetNewSediEmergenza,
    SetNewSediEmergenzaData,
    UpdateSediEmergenza,
    UpdateSediEmergenzaData
} from '../../actions/sedi-emergenza-crud/sedi-emergenza-crud.actions';

export interface SediEmergenzaCRUDStateModel {
    sediEmergenza: TreeviewItem;
    sediEmergenzaData: ItemSediEmergenzaData[];
    _backupSediEmergenza: TreeviewItem;
    _backupSediEmergenzaData: ItemSediEmergenzaData[];
    editMode: boolean;
}

export const SediEmergenzaCRUDStateDefaults: SediEmergenzaCRUDStateModel = {
    sediEmergenza: null,
    sediEmergenzaData: null,
    _backupSediEmergenza: null,
    _backupSediEmergenzaData: null,
    editMode: undefined,
};

@Injectable()
@State<SediEmergenzaCRUDStateModel>({
    name: 'sediEmergenzaCRUD',
    defaults: SediEmergenzaCRUDStateDefaults
})

export class SediEmergenzaCrudState {

    @Selector()
    static sediEmergenza(state: SediEmergenzaCRUDStateModel): TreeviewItem {
        return state.sediEmergenza;
    }

    @Selector()
    static sediEmergenzaData(state: SediEmergenzaCRUDStateModel): ItemSediEmergenzaData[] {
        return state.sediEmergenzaData;
    }

    @Selector()
    static _backupSediEmergenza(state: SediEmergenzaCRUDStateModel): TreeviewItem {
        return state._backupSediEmergenza;
    }

    @Selector()
    static _backupSediEmergenzaData(state: SediEmergenzaCRUDStateModel): ItemSediEmergenzaData[] {
        return state._backupSediEmergenzaData;
    }

    @Selector()
    static editMode(state: SediEmergenzaCRUDStateModel): boolean {
        return state.editMode;
    }

    @Action(SetNewSediEmergenza)
    setNewSediEmergenza({ patchState }: StateContext<SediEmergenzaCRUDStateModel>, action: SetNewSediEmergenza): void {
        patchState({
            sediEmergenza: action.sediEmergenza
        });
    }

    @Action(SetNewSediEmergenzaData)
    setNewSediEmergenzaData({ patchState }: StateContext<SediEmergenzaCRUDStateModel>, action: SetNewSediEmergenzaData): void {
        patchState({
            sediEmergenzaData: action.data
        });
    }

    @Action(DeleteSediEmergenza)
    deleteSediEmergenza({ getState }: StateContext<SediEmergenzaCRUDStateModel>): void {
        const state = getState();
        // this.triageService.delete(codTipologia, codDettaglioTipologia).subscribe((res: any) => {
        //     console.log('Delete triage service response', res);
        // });
    }

    @Action(ResetSediEmergenza)
    resetSediEmergenza({ getState, patchState }: StateContext<SediEmergenzaCRUDStateModel>): void {
        const state = getState();
        const backupSediEmergenza = state._backupSediEmergenza;
        const backupSediEmergenzaData = state._backupSediEmergenzaData;
        patchState({
            sediEmergenza: backupSediEmergenza,
            sediEmergenzaData: backupSediEmergenzaData
        });
    }

    @Action(AddSediEmergenzaData)
    addSediEmergenzaData({ setState }: StateContext<SediEmergenzaCRUDStateModel>, action: AddSediEmergenzaData): void {
        setState(
            patch({
                sediEmergenzaData: append<ItemSediEmergenzaData>([action.itemData])
            })
        );
    }

    // TODO: utilizzare
    @Action(UpdateSediEmergenzaData)
    updateSediEmergenzaData({ setState }: StateContext<SediEmergenzaCRUDStateModel>, action: UpdateSediEmergenzaData): void {
        setState(
            patch({
                sediEmergenzaData: updateItem<ItemSediEmergenzaData>((itemData: ItemSediEmergenzaData) => itemData.itemValue === action.itemData.itemValue, action.itemData)
            })
        );
    }

    @Action(DeleteSediEmergenzaData)
    deleteSediEmergenzaData({ setState }: StateContext<SediEmergenzaCRUDStateModel>, action: DeleteSediEmergenzaData): void {
        setState(
            patch({
                sediEmergenzaData: removeItem<ItemSediEmergenzaData>((itemData: ItemSediEmergenzaData) => itemData.itemValue === action.itemDataValue)
            })
        );
    }

    @Action(AddSediEmergenza)
    addSediEmergenza({ getState, dispatch }: StateContext<SediEmergenzaCRUDStateModel>): void {
        const state = getState();
        const sediEmergenza = state.sediEmergenza;
        const sediEmergenzaData = state.sediEmergenzaData;
        // TODO: fare l'update dell'emergenza con l'alberatura delle sedi
    }

    @Action(UpdateSediEmergenza)
    updateSediEmergenza({ getState, dispatch }: StateContext<SediEmergenzaCRUDStateModel>): void {
        const state = getState();
        const sediEmergenza = state.sediEmergenza;
        const sediEmergenzaData = state.sediEmergenzaData;
        // TODO: fare l'update dell'emergenza con la nuova alberatura delle sedi
    }

    @Action(ClearStateSediEmergenzaCrud)
    clearStateSediEmergenzaCrud({ patchState }: StateContext<SediEmergenzaCRUDStateModel>): void {
        patchState(SediEmergenzaCRUDStateDefaults);
    }
}
