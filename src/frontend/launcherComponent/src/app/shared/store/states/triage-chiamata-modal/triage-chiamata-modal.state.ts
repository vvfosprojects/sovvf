import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { TriageService } from '../../../../core/service/triage/triage.service';
import {
    GetDettagliTipologieByCodTipologia,
    ClearDettagliTipologie,
    SetDettaglioTipologiaTriageChiamata,
    SetTipologiaTriageChiamata,
    SetTriageChiamata,
    ClearTipologiaTriageChiamata,
    ClearDettaglioTipologiaTriageChiamata,
    ClearTriageChiamata
} from '../../actions/triage-modal/triage-modal.actions';
import { GetDettaglioTipologiaByCodTipologiaDto } from '../../../interface/dto/dettaglio-tipologia-dto.interface';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';
import { TreeviewItem } from 'ngx-treeview';
import { ItemTriageData } from '../../../interface/item-triage-data.interface';

export interface TriageChiamataModalStateModel {
    dettagliTipologia: DettaglioTipologia[];
    codTipologiaSelezionata: number;
    codDettaglioTipologiaSelezionato: number;
    triage: TreeviewItem;
    triageData: ItemTriageData[];
    idTriage: string;
}

export const TriageChiamataModalStateDefaults: TriageChiamataModalStateModel = {
    dettagliTipologia: null,
    codTipologiaSelezionata: undefined,
    codDettaglioTipologiaSelezionato: undefined,
    triage: null,
    triageData: null,
    idTriage: undefined
};

@Injectable()
@State<TriageChiamataModalStateModel>({
    name: 'triageChiamataModal',
    defaults: TriageChiamataModalStateDefaults
})

export class TriageChiamataModalState {

    constructor(private detttagliTipologieService: DetttagliTipologieService,
                private triageService: TriageService) {
    }

    @Selector()
    static dettagliTipologia(state: TriageChiamataModalStateModel): DettaglioTipologia[] {
        return state.dettagliTipologia;
    }

    @Selector()
    static triage(state: TriageChiamataModalStateModel): TreeviewItem {
        return state.triage;
    }

    @Selector()
    static triageData(state: TriageChiamataModalStateModel): ItemTriageData[] {
        return state.triageData;
    }

    @Action(GetDettagliTipologieByCodTipologia)
    getDettagliTipologieByCodTipologia({ patchState }: StateContext<TriageChiamataModalStateModel>, action: GetDettagliTipologieByCodTipologia): void {
        this.detttagliTipologieService.getDettaglioTipologiaByCodTipologia(action.codTipologia).subscribe((response: GetDettaglioTipologiaByCodTipologiaDto) => {
            patchState({
                dettagliTipologia: response.listaDettaglioTipologie
            });
        });
    }

    @Action(ClearDettagliTipologie)
    clearDettagliTipologie({ patchState }: StateContext<TriageChiamataModalStateModel>): void {
        patchState({
            dettagliTipologia: TriageChiamataModalStateDefaults.dettagliTipologia
        });
    }

    @Action(SetTipologiaTriageChiamata)
    setTipologiaTriageChiamata({ patchState }: StateContext<TriageChiamataModalStateModel>, action: SetTipologiaTriageChiamata): void {
        patchState({
            codTipologiaSelezionata: action.codTipologia
        });
    }

    @Action(ClearTipologiaTriageChiamata)
    clearTipologiaTriageChiamata({ patchState }: StateContext<TriageChiamataModalStateModel>): void {
        patchState({
            codTipologiaSelezionata: TriageChiamataModalStateDefaults.codTipologiaSelezionata
        });
    }

    @Action(SetDettaglioTipologiaTriageChiamata)
    setDettaglioTipologiaTriageChiamata({ patchState, dispatch }: StateContext<TriageChiamataModalStateModel>, action: SetDettaglioTipologiaTriageChiamata): void {
        patchState({
            codDettaglioTipologiaSelezionato: action.codDettaglioTipologia
        });
        dispatch(new SetTriageChiamata());
    }

    @Action(ClearDettaglioTipologiaTriageChiamata)
    clearDettaglioTipologiaTriageChiamata({ patchState }: StateContext<TriageChiamataModalStateModel>): void {
        patchState({
            codDettaglioTipologiaSelezionato: TriageChiamataModalStateDefaults.codDettaglioTipologiaSelezionato
        });
    }

    @Action(SetTriageChiamata)
    setTriageChiamata({ getState, patchState }: StateContext<TriageChiamataModalStateModel>): void {
        const state = getState();
        const codTipologiaSelezionata = state.codTipologiaSelezionata;
        const codDettaglioTipologiaSelezionata = state.codDettaglioTipologiaSelezionato;
        this.triageService.get(codTipologiaSelezionata, codDettaglioTipologiaSelezionata).subscribe((res: { triage: { id: string, data: TreeviewItem }, triageData: ItemTriageData[] }) => {
            patchState({
                idTriage: res?.triage?.id,
                triage: res?.triage?.data,
                triageData: res?.triageData
            });
        });
    }

    @Action(ClearTriageChiamata)
    clearTriageChiamata({ patchState }: StateContext<TriageChiamataModalStateModel>): void {
        patchState({
            idTriage: TriageChiamataModalStateDefaults.idTriage,
            triage: TriageChiamataModalStateDefaults.triage,
            triageData: TriageChiamataModalStateDefaults.triageData
        });
    }
}
