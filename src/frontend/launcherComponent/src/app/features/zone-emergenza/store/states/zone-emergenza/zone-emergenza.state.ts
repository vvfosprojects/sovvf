import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { PresaInCaricoEmergenza, TipologiaEmergenza, ZonaEmergenza } from '../../../../../shared/model/zona-emergenza.model';
import { ZoneEmergenzaService } from '../../../../../core/service/zone-emergenza-service/zone-emergenza.service';
import {
    AddZonaEmergenza,
    GetTipologieEmergenza,
    GetZoneEmergenza,
    SetTipologieEmergenza,
    SetZoneEmergenza,
    StartLoadingTipologieEmergenza,
    StartLoadingZoneEmergenza,
    StopLoadingTipologieEmergenza,
    StopLoadingZoneEmergenza
} from '../../actions/zone-emergenza/zone-emergenza.actions';
import { ZonaEmergenzaForm } from '../../../../../shared/interface/zona-emergenza-form.interface';
import { Localita } from '../../../../../shared/model/localita.model';

export interface ZoneEmergenzaStateModel {
    zoneEmergenza: ZonaEmergenza[];
    tipologieZonaEmergenza: TipologiaEmergenza[];
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
        patchState({
            tipologieZonaEmergenza: action.tipologieEmergenza
        });
    }

    @Action(AddZonaEmergenza)
    addZonaEmergenza({ getState, dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new StartLoadingZoneEmergenza());
        const state = getState();
        const formValue = state.zonaEmergenzaForm.model;
        // TODO: prendere i dati dalla form "zonaEmergenzaForm" (formValue)
        const zonaEmergenza = new ZonaEmergenza(
            null,
            null,
            'Terremoti vicino Roma',
            'RM.1000',
            {
                id: '6183b448bac2c0842de1b50f',
                emergenza: [
                    'Alluvione',
                    'Maltempo',
                    'Neve'
                ],
                moduli: {
                    mob_Immediata: [
                        'MC.PCA',
                        'MC.ASS',
                        'MO.TAST',
                        'MA.TAS',
                        'MO.CRAB',
                        'MO.SMTZ',
                        'MO.NEGH',
                        'MO.Valanghe',
                        'MO.MCP',
                        'MO.ACP',
                        'ML.LG1',
                        'MA.AER',
                        'MA. APR'
                    ],
                    mob_Pot_Int: [
                        'MO.HCP',
                        'MO.ACP',
                        'ML.MED',
                        'MA.ICT',
                        'MA.AMM',
                        'MA.MTM',
                        'MA.AER',
                        'ML.KTP'
                    ],
                    mob_Consolidamento: [
                        'ML.PES',
                        'ML.KTP',
                        'MA.MTP',
                        'MC.ICS.OP',
                        'MC.ICS.PIA',
                        'MC.ICS.LOG',
                        'MC.ICS.AMM',
                        'MC.ICS.SAN'
                    ]
                }
            },
            null,
            new Localita(
                {
                    latitudine: 41.847675,
                    longitudine: 12.4843
                },
                'Via Fontanellato'
            ),
            null
        );
        this.zoneEmergenzaService.add(zonaEmergenza).subscribe((response: ResponseInterface) => {
            dispatch([
                new GetZoneEmergenza(),
                new StopLoadingZoneEmergenza()
            ]);
        }, error => {
            dispatch(new StopLoadingZoneEmergenza());
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
}
