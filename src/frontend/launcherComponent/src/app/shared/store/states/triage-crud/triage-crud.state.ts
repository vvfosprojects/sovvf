import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
    ClearDettagliTipologie,
    ClearTriage,
    GetDettagliTipologieByCodTipologia,
    GetTriageByCodDettaglioTipologia,
    AddTriage,
    SetDettaglioTipologiaTriage,
    SetNewTriage,
    SetNewTriageData,
    UpdateTriage,
    DeleteTriage,
    AddTriageData,
    DeleteTriageData,
    UpdateTriageData
} from '../../actions/triage-crud/triage-crud.actions';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { TriageService } from '../../../../core/service/triage/triage.service';
import { GetDettaglioTipologiaByCodTipologiaDto } from '../../../interface/dto/dettaglio-tipologia-dto.interface';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';
import { ItemTriageData } from '../../../interface/item-triage-data.interface';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';

export interface TriageStateModel {
    idTriage: string;
    dettagliTipologie: DettaglioTipologia[];
    dettaglioTipologia: DettaglioTipologia;
    triageByDettaglioTipologia: TreeItem;
    triageDataByDettaglioTipologia: ItemTriageData[];
    _backupTriageByDettaglioTipologia: TreeItem;
    _backupTriageDataByDettaglioTipologia: ItemTriageData[];
    editMode: boolean;
}

export const TriageStateDefaults: TriageStateModel = {
    idTriage: undefined,
    dettagliTipologie: null,
    dettaglioTipologia: null,
    triageByDettaglioTipologia: null,
    triageDataByDettaglioTipologia: null,
    _backupTriageByDettaglioTipologia: null,
    _backupTriageDataByDettaglioTipologia: null,
    editMode: undefined,
};

@Injectable()
@State<TriageStateModel>({
    name: 'triageCRUD',
    defaults: TriageStateDefaults
})

export class TriageCrudState {

    constructor(private detttagliTipologieService: DetttagliTipologieService,
                private triageService: TriageService) {
    }

    @Selector()
    static dettagliTipologie(state: TriageStateModel): DettaglioTipologia[] {
        return state.dettagliTipologie;
    }

    @Selector()
    static dettaglioTipologia(state: TriageStateModel): DettaglioTipologia {
        return state.dettaglioTipologia;
    }

    @Selector()
    static triageByDettaglioTipologia(state: TriageStateModel): TreeItem {
        return state.triageByDettaglioTipologia;
    }

    @Selector()
    static triageDataByDettaglioTipologia(state: TriageStateModel): ItemTriageData[] {
        return state.triageDataByDettaglioTipologia;
    }

    @Selector()
    static editMode(state: TriageStateModel): boolean {
        return state.editMode;
    }

    @Action(GetDettagliTipologieByCodTipologia)
    getDettagliTipologieByCodTipologia({ patchState }: StateContext<TriageStateModel>, action: GetDettagliTipologieByCodTipologia): void {
        this.detttagliTipologieService.getDettaglioTipologiaByCodTipologia(action.codTipologia).subscribe((response: GetDettaglioTipologiaByCodTipologiaDto) => {
            patchState({
                dettagliTipologie: response.listaDettaglioTipologie
            });
        });
    }

    @Action(ClearDettagliTipologie)
    clearDettagliTipologie({ patchState }: StateContext<TriageStateModel>): void {
        patchState({
            dettagliTipologie: TriageStateDefaults.dettagliTipologie
        });
    }

    @Action(SetDettaglioTipologiaTriage)
    setDettaglioTipologiaTriage({ getState, patchState }: StateContext<TriageStateModel>, action: SetDettaglioTipologiaTriage): void {
        const dettaglioTipologia = getState().dettagliTipologie.filter((dT: DettaglioTipologia) => dT.codiceDettaglioTipologia === action.codDettaglioTipologia)[0];
        patchState({
            dettaglioTipologia
        });
    }

    @Action(GetTriageByCodDettaglioTipologia)
    getTriageByCodDettaglioTipologia({ patchState }: StateContext<TriageStateModel>, action: GetTriageByCodDettaglioTipologia): void {
        this.triageService.get(action.codTipologia, action.codDettaglioTipologia).subscribe((response: { triage: { id: string, data: TreeviewItem }, triageData }) => {
            patchState({
                idTriage: response.triage?.id,
                triageByDettaglioTipologia: response.triage?.data,
                triageDataByDettaglioTipologia: response.triageData,
                _backupTriageByDettaglioTipologia: response.triage?.data,
                _backupTriageDataByDettaglioTipologia: response.triageData,
                editMode: !!response.triage?.data
            });
        });
    }

    @Action(ClearTriage)
    clearTriage({ patchState }: StateContext<TriageStateModel>): void {
        patchState({
            triageByDettaglioTipologia: null
        });
    }

    @Action(SetNewTriage)
    setNewTriage({ patchState }: StateContext<TriageStateModel>, action: SetNewTriage): void {
        patchState({
            triageByDettaglioTipologia: action.triage
        });
    }

    @Action(SetNewTriageData)
    setNewTriageData({ patchState }: StateContext<TriageStateModel>, action: SetNewTriageData): void {
        patchState({
            triageDataByDettaglioTipologia: action.data
        });
    }

    @Action(DeleteTriage)
    deleteTriage({ getState }: StateContext<TriageStateModel>): void {
        const state = getState();
        const codTipologia = state.dettaglioTipologia.codiceTipologia;
        const codDettaglioTipologia = state.dettaglioTipologia.codiceDettaglioTipologia;
        this.triageService.delete(codTipologia, codDettaglioTipologia).subscribe((res: any) => {
            console.log('Delete triage service response', res);
        });
    }

    @Action(AddTriageData)
    addTriageData({ setState }: StateContext<TriageStateModel>, action: AddTriageData): void {
        setState(
            patch({
                triageDataByDettaglioTipologia: append<ItemTriageData>([action.itemData])
            })
        );
    }

    // TODO: utilizzare
    @Action(UpdateTriageData)
    updateTriageData({ setState }: StateContext<TriageStateModel>, action: UpdateTriageData): void {
        setState(
            patch({
                triageDataByDettaglioTipologia: updateItem<ItemTriageData>((itemData: ItemTriageData) => itemData.itemValue === action.itemData.itemValue, action.itemData)
            })
        );
    }

    @Action(DeleteTriageData)
    deleteTriageData({ setState }: StateContext<TriageStateModel>, action: DeleteTriageData): void {
        setState(
            patch({
                triageDataByDettaglioTipologia: removeItem<ItemTriageData>((itemData: ItemTriageData) => itemData.itemValue === action.itemDataValue)
            })
        );
    }

    @Action(AddTriage)
    addTriage({ getState, dispatch }: StateContext<TriageStateModel>): void {
        const state = getState();
        const codTipologia = state.dettaglioTipologia.codiceTipologia;
        const codDettaglioTipologia = state.dettaglioTipologia.codiceDettaglioTipologia;
        const triage = state.triageByDettaglioTipologia;
        const triageData = state.triageDataByDettaglioTipologia;
        this.triageService.add(codTipologia, codDettaglioTipologia, triage, triageData).subscribe((res: any) => {
            dispatch(new GetTriageByCodDettaglioTipologia(codTipologia, codDettaglioTipologia));
        });
    }

    @Action(UpdateTriage)
    updateTriage({ getState, dispatch }: StateContext<TriageStateModel>): void {
        const state = getState();
        const idTriage = state.idTriage;
        const codTipologia = state.dettaglioTipologia.codiceTipologia;
        const codDettaglioTipologia = state.dettaglioTipologia.codiceDettaglioTipologia;
        const triage = state.triageByDettaglioTipologia;
        const triageData = state.triageDataByDettaglioTipologia;
        this.triageService.update(idTriage, codTipologia, codDettaglioTipologia, triage, triageData).subscribe((res: any) => {
            dispatch(new GetTriageByCodDettaglioTipologia(codTipologia, codDettaglioTipologia));
        });
    }
}
