import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DettagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { TriageService } from '../../../../core/service/triage/triage.service';
import {
    GetDettagliTipologieByCodTipologia,
    ClearDettagliTipologie,
    SetDettaglioTipologiaTriageChiamata,
    SetTipologiaTriageChiamata,
    SetTriageChiamata,
    ClearTipologiaTriageChiamata,
    ClearDettaglioTipologiaTriageChiamata,
    ClearTriageChiamata,
    StartLoadingTriageChiamata,
    StopLoadingTriageChiamata
} from '../../actions/triage-modal/triage-modal.actions';
import { GetDettaglioTipologiaByCodTipologiaDto } from '../../../interface/dto/dettagli-tipologie/dettaglio-tipologia-dto.interface';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';
import { TreeviewItem } from 'ngx-treeview';
import { ItemTriageData } from '../../../interface/item-triage-data.interface';
import { PosInterface } from '../../../interface/pos.interface';
import { StartLoadingDettagliTipologia, StopLoadingDettagliTipologia } from '../../../../features/home/store/actions/form-richiesta/scheda-telefonata.actions';

export interface TriageChiamataModalStateModel {
    dettagliTipologia: DettaglioTipologia[];
    codTipologiaSelezionata: number;
    codDettaglioTipologiaSelezionato: number;
    triage: TreeviewItem;
    triageData: ItemTriageData[];
    idTriage: string;
    pos: PosInterface[];
    loadingTriageChiamata: boolean;
}

export const TriageChiamataModalStateDefaults: TriageChiamataModalStateModel = {
    dettagliTipologia: undefined,
    codTipologiaSelezionata: undefined,
    codDettaglioTipologiaSelezionato: undefined,
    triage: undefined,
    triageData: undefined,
    idTriage: undefined,
    pos: undefined,
    loadingTriageChiamata: undefined
};

@Injectable()
@State<TriageChiamataModalStateModel>({
    name: 'triageChiamataModal',
    defaults: TriageChiamataModalStateDefaults
})

export class TriageChiamataModalState {

    constructor(private detttagliTipologieService: DettagliTipologieService,
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

    @Selector()
    static loadingTriageChiamata(state: TriageChiamataModalStateModel): boolean {
        return state.loadingTriageChiamata;
    }

    @Action(GetDettagliTipologieByCodTipologia)
    getDettagliTipologieByCodTipologia({ patchState, dispatch }: StateContext<TriageChiamataModalStateModel>, action: GetDettagliTipologieByCodTipologia): void {
        dispatch(new StartLoadingTriageChiamata());
        dispatch(new StartLoadingDettagliTipologia());
        this.detttagliTipologieService.getDettaglioTipologiaByCodTipologia(action.codTipologia).subscribe((response: GetDettaglioTipologiaByCodTipologiaDto) => {
            patchState({
                dettagliTipologia: response.listaDettaglioTipologie
            });
            dispatch([
                new StopLoadingTriageChiamata(),
                new StopLoadingDettagliTipologia()
            ]);
        }, () => {
            dispatch([
                new StopLoadingTriageChiamata(),
                new StopLoadingDettagliTipologia()
            ]);
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
    setDettaglioTipologiaTriageChiamata({patchState, dispatch }: StateContext<TriageChiamataModalStateModel>, action: SetDettaglioTipologiaTriageChiamata): void {
        patchState({
            codDettaglioTipologiaSelezionato: action.codDettaglioTipologia,
            pos: action.pos
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
    setTriageChiamata({ getState, patchState, dispatch }: StateContext<TriageChiamataModalStateModel>): void {
        const state = getState();
        const codTipologiaSelezionata = state.codTipologiaSelezionata;
        const codDettaglioTipologiaSelezionata = state.codDettaglioTipologiaSelezionato;
        dispatch(new StartLoadingTriageChiamata());
        this.triageService.get(codTipologiaSelezionata, codDettaglioTipologiaSelezionata).subscribe((res: { triage: { id: string, data: TreeviewItem }, triageData: ItemTriageData[] }) => {
            patchState({
                idTriage: res?.triage?.id,
                triage: res?.triage?.data,
                triageData: res?.triageData
            });
            dispatch(new StopLoadingTriageChiamata());
        }, () => {
            dispatch(new StopLoadingTriageChiamata());
        });
    }

    @Action(ClearTriageChiamata)
    clearTriageChiamata({ patchState }: StateContext<TriageChiamataModalStateModel>): void {
        patchState({
            idTriage: TriageChiamataModalStateDefaults.idTriage,
            triage: TriageChiamataModalStateDefaults.triage,
            triageData: TriageChiamataModalStateDefaults.triageData,
            pos: TriageChiamataModalStateDefaults.pos
        });
    }

    @Action(StartLoadingTriageChiamata)
    startLoadingTriageChiamata({ patchState }: StateContext<TriageChiamataModalStateModel>): void {
        patchState({
            loadingTriageChiamata: true
        });
    }

    @Action(StopLoadingTriageChiamata)
    stopLoadingTriageChiamata({ patchState }: StateContext<TriageChiamataModalStateModel>): void {
        patchState({
            loadingTriageChiamata: false
        });
    }
}
