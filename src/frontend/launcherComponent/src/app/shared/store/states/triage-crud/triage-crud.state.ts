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
    DeleteTriage
} from '../../actions/triage/triage.actions';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { TriageService } from '../../../../core/service/triage/triage.service';
import { GetDettaglioTipologiaByCodTipologiaDto } from '../../../interface/dto/dettaglio-tipologia-dto.interface';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';
import { ItemTriageData } from '../../../interface/item-triage-data.interface';

export interface TriageStateModel {
    dettagliTipologie: DettaglioTipologia[];
    dettaglioTipologia: DettaglioTipologia;
    triageByDettaglioTipologia: TreeItem;
    triageDataByDettaglioTipologia: ItemTriageData[];
    newTriage: TreeItem;
    newTriageData: ItemTriageData[];
}

export const TriageStateDefaults: TriageStateModel = {
    dettagliTipologie: null,
    dettaglioTipologia: null,
    triageByDettaglioTipologia: null,
    triageDataByDettaglioTipologia: null,
    newTriage: null,
    newTriageData: null
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
        this.triageService.get(action.codTipologia, action.codDettaglioTipologia).subscribe((response: { triage: { data: TreeviewItem }, triageData }) => {
            patchState({
                triageByDettaglioTipologia: response.triage?.data,
                triageDataByDettaglioTipologia: response.triageData
            });
        });
    }

    @Action(ClearTriage)
    clearTriage({ patchState }: StateContext<TriageStateModel>): void {
        patchState({
            newTriage: null
        });
    }

    @Action(SetNewTriage)
    setNewTriage({ patchState }: StateContext<TriageStateModel>, action: SetNewTriage): void {
        patchState({
            newTriage: action.triage
        });
    }

    @Action(SetNewTriageData)
    setNewTriageData({ patchState }: StateContext<TriageStateModel>, action: SetNewTriageData): void {
        patchState({
            newTriageData: action.data
        });
    }

    @Action(AddTriage)
    addTriage({ getState }: StateContext<TriageStateModel>): void {
        const state = getState();
        const codTipologia = state.dettaglioTipologia.codiceTipologia;
        const codDettaglioTipologia = state.dettaglioTipologia.codiceDettaglioTipologia;
        const triage = state.newTriage;
        const triageData = state.newTriageData;
        this.triageService.add(codTipologia, codDettaglioTipologia, triage, triageData).subscribe((res: any) => {
            console.log('Save triage service response', res);
        });
    }

    @Action(UpdateTriage)
    updateTriage({ getState }: StateContext<TriageStateModel>): void {
        const state = getState();
        const codTipologia = state.dettaglioTipologia.codiceTipologia;
        const codDettaglioTipologia = state.dettaglioTipologia.codiceDettaglioTipologia;
        const triage = state.newTriage;
        const triageData = state.newTriageData;
        this.triageService.update(codTipologia, codDettaglioTipologia, triage, triageData).subscribe((res: any) => {
            console.log('Update triage service response', res);
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
}
