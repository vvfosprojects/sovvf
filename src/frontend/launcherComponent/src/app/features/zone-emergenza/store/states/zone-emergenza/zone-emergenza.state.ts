import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { TipologiaEmergenza, ZonaEmergenza } from '../../../../../shared/model/zona-emergenza.model';
import { ZoneEmergenzaService } from '../../../../../core/service/zone-emergenza-service/zone-emergenza.service';
import {
    AddZonaEmergenza,
    GetTipologieEmergenza,
    GetZoneEmergenza,
    ResetZonaEmergenzaForm,
    SetTipologieEmergenza,
    SetZoneEmergenza,
    StartLoadingTipologieEmergenza,
    StartLoadingZoneEmergenza,
    StopLoadingTipologieEmergenza,
    StopLoadingZoneEmergenza
} from '../../actions/zone-emergenza/zone-emergenza.actions';
import { ZonaEmergenzaForm } from '../../../../../shared/interface/zona-emergenza-form.interface';
import { Localita } from '../../../../../shared/model/localita.model';
import { makeCopy } from '../../../../../shared/helper/function-generiche';

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
    loadingZoneEmergenza: boolean;
    loadingTipologieEmergenza: boolean;
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
    loadingZoneEmergenza: false,
    loadingTipologieEmergenza: false
};

@Injectable()
@State<ZoneEmergenzaStateModel>({
    name: 'zoneEmergenza',
    defaults: ZoneEmergenzaStateModelDefaults,
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
        const tipologiaZoneEmergenza = state.tipologieZonaEmergenza.filter((t: any) => t.id === formValue.tipologia)[0];
        const tipologiaZoneEmergenzaCopy = makeCopy(tipologiaZoneEmergenza);
        tipologiaZoneEmergenzaCopy.emergenza = [tipologiaZoneEmergenza.emergenza[0]];
        const zonaEmergenza = new ZonaEmergenza(
            null,
            null,
            null,
            formValue.descrizione ? formValue.descrizione : null,
            tipologiaZoneEmergenzaCopy,
            null,
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
}
