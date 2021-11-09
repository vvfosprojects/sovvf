import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { TipologiaEmergenza, ZonaEmergenza } from '../../../../../shared/model/zona-emergenza.model';
import { ZoneEmergenzaService } from '../../../../../core/service/zone-emergenza-service/zone-emergenza.service';
import {
    AddZonaEmergenza, AllertaCONZonaEmergenza,
    AnnullaZonaEmergenza,
    EditZonaEmergenza,
    GetTipologieEmergenza,
    GetZoneEmergenza, ResetAllertaCONZonaEmergenzaForm,
    ResetAnnullaZonaEmergenzaForm,
    ResetZonaEmergenzaForm,
    SetMappaActiveValue,
    SetTipologieEmergenza,
    SetZoneEmergenza,
    StartLoadingTipologieEmergenza,
    StartLoadingZoneEmergenza,
    StopLoadingTipologieEmergenza,
    StopLoadingZoneEmergenza
} from '../../actions/zone-emergenza/zone-emergenza.actions';
import { ZonaEmergenzaForm } from '../../../../../shared/interface/forms/zona-emergenza-form.interface';
import { Localita } from '../../../../../shared/model/localita.model';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import { AnnullaZonaEmergenzaForm } from '../../../../../shared/interface/forms/annulla-zona-emergenza-form.interface';
import { AllertaCONZonaEmergenzaForm } from '../../../../../shared/interface/forms/allerta-CON-zona-emergenza-form.interface';

export interface ZoneEmergenzaStateModel {
    zoneEmergenza: ZonaEmergenza[];
    tipologieZonaEmergenza: TipologiaEmergenza[];
    allTipologieZonaEmergenza: { id: string, desc: string }[];
    zonaEmergenzaForm: {
        model: ZonaEmergenzaForm,
        dirty: boolean,
        status: string,
        errors: any
    };
    annullaZonaEmergenzaForm: {
        model: AnnullaZonaEmergenzaForm,
        dirty: boolean,
        status: string,
        errors: any
    };
    allertaCONZonaEmergenzaForm: {
        model: AllertaCONZonaEmergenzaForm,
        dirty: boolean,
        status: string,
        errors: any
    };
    loadingZoneEmergenza: boolean;
    loadingTipologieEmergenza: boolean;
    mappaActive: boolean;
}

export const ZoneEmergenzaStateModelDefaults: ZoneEmergenzaStateModel = {
    zoneEmergenza: null,
    tipologieZonaEmergenza: null,
    allTipologieZonaEmergenza: null,
    zonaEmergenzaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    annullaZonaEmergenzaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    allertaCONZonaEmergenzaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    loadingZoneEmergenza: false,
    loadingTipologieEmergenza: false,
    mappaActive: false
};

@Injectable()
@State<ZoneEmergenzaStateModel>({
    name: 'zoneEmergenza',
    defaults: ZoneEmergenzaStateModelDefaults
})
export class ZoneEmergenzaState {

    constructor(private store: Store,
                private zoneEmergenzaService: ZoneEmergenzaService) {
    }

    @Selector()
    static zoneEmergenza(state: ZoneEmergenzaStateModel): ZonaEmergenza[] {
        return state.zoneEmergenza;
    }

    @Selector()
    static loadingZoneEmergenza(state: ZoneEmergenzaStateModel): boolean {
        return state.loadingZoneEmergenza;
    }

    @Selector()
    static tipologieZonaEmergenza(state: ZoneEmergenzaStateModel): TipologiaEmergenza[] {
        return state.tipologieZonaEmergenza;
    }

    @Selector()
    static allTipologieZonaEmergenza(state: ZoneEmergenzaStateModel): { id: string, desc: string }[] {
        return state.allTipologieZonaEmergenza;
    }

    @Selector()
    static loadingTipologieEmergenza(state: ZoneEmergenzaStateModel): boolean {
        return state.loadingTipologieEmergenza;
    }

    @Selector()
    static mappaActive(state: ZoneEmergenzaStateModel): boolean {
        return state.mappaActive;
    }

    @Action(GetZoneEmergenza)
    getZoneEmergenza({ dispatch }: StateContext<ZoneEmergenzaStateModel>, action: GetZoneEmergenza): void {
        dispatch(new StartLoadingZoneEmergenza());
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.zoneEmergenzaService.getZoneEmergenza(pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetZoneEmergenza(response.dataArray),
                new StopLoadingZoneEmergenza()
            ]);
        }, error => {
            dispatch(new StopLoadingZoneEmergenza());
        });
    }

    @Action(SetZoneEmergenza)
    setZoneEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: SetZoneEmergenza): void {
        patchState({
            zoneEmergenza: action.zoneEmergenza
        });
    }

    @Action(StartLoadingZoneEmergenza)
    startLoadingZoneEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            loadingZoneEmergenza: true
        });
    }

    @Action(StopLoadingZoneEmergenza)
    stopLoadingZoneEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            loadingZoneEmergenza: false
        });
    }

    @Action(GetTipologieEmergenza)
    getTipologieEmergenza({ dispatch }: StateContext<ZoneEmergenzaStateModel>, action: GetZoneEmergenza): void {
        dispatch(new StartLoadingTipologieEmergenza());
        this.zoneEmergenzaService.getTipologieEmergenze().subscribe((response: { listaTipologie: TipologiaEmergenza[] }) => {
            dispatch([
                new SetTipologieEmergenza(response.listaTipologie),
                new StopLoadingTipologieEmergenza()
            ]);
        }, error => {
            dispatch(new StopLoadingTipologieEmergenza());
        });
    }

    @Action(SetTipologieEmergenza)
    setTipologieEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: SetTipologieEmergenza): void {
        const tipologieEmergenza = action.tipologieEmergenza;
        const allTipologieEmergenza = [];
        tipologieEmergenza.forEach((t: any) => {
            t.emergenza.forEach((e: any) => {
                allTipologieEmergenza.push({
                    id: t.id,
                    desc: e
                });
            });
        });
        patchState({
            tipologieZonaEmergenza: tipologieEmergenza,
            allTipologieZonaEmergenza: allTipologieEmergenza
        });
    }

    @Action(AddZonaEmergenza)
    addZonaEmergenza({ getState, dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new StartLoadingZoneEmergenza());
        const state = getState();
        const formValue = state.zonaEmergenzaForm.model;
        let tipologiaZoneEmergenza: TipologiaEmergenza;
        let indexEmergenza: number;
        state.tipologieZonaEmergenza.forEach((t: TipologiaEmergenza) => {
            t.emergenza.forEach((e: string, i: number) => {
                if (e === formValue.tipologia) {
                    tipologiaZoneEmergenza = t;
                    indexEmergenza = i;
                }
            });
        });
        const tipologiaZoneEmergenzaCopy = makeCopy(tipologiaZoneEmergenza);
        tipologiaZoneEmergenzaCopy.emergenza = [tipologiaZoneEmergenza.emergenza[indexEmergenza]];
        const zonaEmergenza = new ZonaEmergenza(
            null,
            null,
            null,
            formValue.descrizione,
            tipologiaZoneEmergenzaCopy,
            new Localita(
                {
                    latitudine: formValue.latitudine,
                    longitudine: formValue.longitudine
                },
                formValue.indirizzo,
                null,
                null,
                null,
                null,
                null,
                null,
                'sostituire_provincia',
                'sostituire_regione'
            ),
            null,
            false
        );
        this.zoneEmergenzaService.add(zonaEmergenza).subscribe((response: ResponseInterface) => {
            dispatch([
                new GetZoneEmergenza(),
                new ResetZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        }, error => {
            dispatch([
                new ResetZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        });
    }

    @Action(EditZonaEmergenza)
    editZonaEmergenza({ getState, dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new StartLoadingZoneEmergenza());
        const state = getState();
        const formValue = state.zonaEmergenzaForm.model;
        let tipologiaZoneEmergenza: TipologiaEmergenza;
        let indexEmergenza: number;
        state.tipologieZonaEmergenza.forEach((t: TipologiaEmergenza) => {
            t.emergenza.forEach((e: string, i: number) => {
                if (e === formValue.tipologia) {
                    tipologiaZoneEmergenza = t;
                    indexEmergenza = i;
                }
            });
        });
        const tipologiaZoneEmergenzaCopy = makeCopy(tipologiaZoneEmergenza);
        tipologiaZoneEmergenzaCopy.emergenza = [tipologiaZoneEmergenza.emergenza[indexEmergenza]];
        const zonaEmergenza = new ZonaEmergenza(
            formValue.id,
            formValue.codEmergenza,
            formValue.codComandoRichiedente,
            formValue.descrizione,
            tipologiaZoneEmergenzaCopy,
            new Localita(
                {
                    latitudine: formValue.latitudine,
                    longitudine: formValue.longitudine
                },
                formValue.indirizzo,
                null,
                null,
                null,
                null,
                null,
                null,
                'sostituire_provincia',
                'sostituire_regione'
            ),
            formValue.listaEventi,
            formValue.annullata
        );
        this.zoneEmergenzaService.edit(zonaEmergenza).subscribe((response: ResponseInterface) => {
            dispatch([
                new GetZoneEmergenza(),
                new ResetZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        }, error => {
            dispatch([
                new ResetZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        });
    }

    @Action(AnnullaZonaEmergenza)
    annullaZonaEmergenza({ getState, dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new StartLoadingZoneEmergenza());
        const state = getState();
        const formValue = state.annullaZonaEmergenzaForm.model;
        const params = {
            id: formValue.id,
            motivazione: formValue.motivazione ? formValue.motivazione : null
        };
        this.zoneEmergenzaService.annulla(params).subscribe((response: ResponseInterface) => {
            dispatch([
                new GetZoneEmergenza(),
                new ResetAnnullaZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        }, error => {
            dispatch([
                new ResetAnnullaZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        });
    }

    @Action(AllertaCONZonaEmergenza)
    allertaCONZonaEmergenza({ getState, dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new StartLoadingZoneEmergenza());
        const state = getState();
        const formValue = state.allertaCONZonaEmergenzaForm.model;
        const params = {
            id: formValue.id,
            descrizioneEmergenza: formValue.descrizioneEmergenza
        };
        this.zoneEmergenzaService.allertaEmergenzaCON(params).subscribe((response: ResponseInterface) => {
            dispatch([
                new GetZoneEmergenza(),
                new ResetAllertaCONZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        }, error => {
            dispatch([
                new ResetAllertaCONZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        });
    }

    @Action(StartLoadingTipologieEmergenza)
    startLoadingTipologieEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            loadingTipologieEmergenza: true
        });
    }

    @Action(StopLoadingTipologieEmergenza)
    stopLoadingTipologieEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            loadingTipologieEmergenza: false
        });
    }

    @Action(ResetZonaEmergenzaForm)
    resetZonaEmergenzaForm({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            zonaEmergenzaForm: ZoneEmergenzaStateModelDefaults.zonaEmergenzaForm
        });
    }

    @Action(ResetAnnullaZonaEmergenzaForm)
    resetAnnullaZonaEmergenzaForm({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            annullaZonaEmergenzaForm: ZoneEmergenzaStateModelDefaults.annullaZonaEmergenzaForm
        });
    }

    @Action(ResetAllertaCONZonaEmergenzaForm)
    resetAllertaCONZonaEmergenzaForm({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            allertaCONZonaEmergenzaForm: ZoneEmergenzaStateModelDefaults.allertaCONZonaEmergenzaForm
        });
    }

    @Action(SetMappaActiveValue)
    setMappaActiveValue({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: SetMappaActiveValue): void {
        patchState({
            mappaActive: action.value
        });
    }
}
