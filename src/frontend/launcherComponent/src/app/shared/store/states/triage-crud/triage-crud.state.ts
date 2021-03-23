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
    UpdateTriageData,
    GetGeneriMezzo,
    ClearGeneriMezzo,
    ResetTriage,
    ClearStateTriageCrud
} from '../../actions/triage-crud/triage-crud.actions';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { TriageService } from '../../../../core/service/triage/triage.service';
import { GetDettaglioTipologiaByCodTipologiaDto } from '../../../interface/dto/dettaglio-tipologia-dto.interface';
import { TreeviewItem } from 'ngx-treeview';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';
import { ItemTriageData } from '../../../interface/item-triage-data.interface';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { GeneriMezzoService } from '../../../../core/service/generi-mezzo/generi-mezzo.service';
import { GenereMezzo } from '../../../interface/genere-mezzo.interface';

export interface TriageStateModel {
    idTriage: string;
    dettagliTipologie: DettaglioTipologia[];
    dettaglioTipologia: DettaglioTipologia;
    triageByDettaglioTipologia: TreeviewItem;
    triageDataByDettaglioTipologia: ItemTriageData[];
    _backupTriageByDettaglioTipologia: TreeviewItem;
    _backupTriageDataByDettaglioTipologia: ItemTriageData[];
    editMode: boolean;
    generiMezzo: GenereMezzo[];
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
    generiMezzo: null
};

@Injectable()
@State<TriageStateModel>({
    name: 'triageCRUD',
    defaults: TriageStateDefaults
})

export class TriageCrudState {

    constructor(private detttagliTipologieService: DetttagliTipologieService,
                private triageService: TriageService,
                private generiMezzoService: GeneriMezzoService) {
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
    static triageByDettaglioTipologia(state: TriageStateModel): TreeviewItem {
        return state.triageByDettaglioTipologia;
    }

    @Selector()
    static triageDataByDettaglioTipologia(state: TriageStateModel): ItemTriageData[] {
        return state.triageDataByDettaglioTipologia;
    }

    @Selector()
    static _backupTriageByDettaglioTipologia(state: TriageStateModel): TreeviewItem {
        return state._backupTriageByDettaglioTipologia;
    }

    @Selector()
    static _backupTriageDataByDettaglioTipologia(state: TriageStateModel): ItemTriageData[] {
        return state._backupTriageDataByDettaglioTipologia;
    }

    @Selector()
    static editMode(state: TriageStateModel): boolean {
        return state.editMode;
    }

    @Selector()
    static generiMezzo(state: TriageStateModel): GenereMezzo[] {
        return state.generiMezzo;
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

    @Action(GetGeneriMezzo)
    getGeneriMezzo({ patchState }: StateContext<TriageStateModel>): void {
        this.generiMezzoService.get().subscribe((generiMezzo: GenereMezzo[]) => {
            patchState({
                generiMezzo
            });
        });
    }

    @Action(ClearGeneriMezzo)
    clearGeneriMezzo({ patchState }: StateContext<TriageStateModel>): void {
        patchState({
            generiMezzo: TriageStateDefaults.generiMezzo
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

    @Action(ResetTriage)
    resetTriage({ getState, patchState }: StateContext<TriageStateModel>): void {
        const state = getState();
        const backupTriage = state._backupTriageByDettaglioTipologia;
        const backupTriageData = state._backupTriageDataByDettaglioTipologia;
        patchState({
            triageByDettaglioTipologia: backupTriage,
            triageDataByDettaglioTipologia: backupTriageData
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

    @Action(ClearStateTriageCrud)
    clearStateTriageCrud({ patchState }: StateContext<TriageStateModel>): void {
        patchState(TriageStateDefaults);
    }
}
