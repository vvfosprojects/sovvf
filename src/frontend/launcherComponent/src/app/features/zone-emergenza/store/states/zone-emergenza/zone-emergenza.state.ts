import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { TipologiaEmergenza, ZonaEmergenza } from '../../../model/zona-emergenza.model';
import { ZoneEmergenzaService } from '../../../../../core/service/zone-emergenza-service/zone-emergenza.service';
import {
    AddDoa,
    AddPca,
    AddZonaEmergenza,
    AllertaCONZonaEmergenza,
    AnnullaZonaEmergenza,
    DeleteDoa,
    DeletePca,
    EditZonaEmergenza,
    GetTipologieEmergenza,
    GetZonaEmergenzaById,
    GetZoneEmergenza,
    ResetAllertaCONZonaEmergenzaForm,
    ResetAnnullaZonaEmergenzaForm,
    ResetDoaForm,
    ResetPcaForm,
    ResetZonaEmergenzaForm,
    SaveCraZonaEmergenza,
    SetEventoRichiestaGestitoZonaEmergenza,
    SetMappaActiveValue,
    SetTipologieEmergenza,
    SetZonaEmergenzaById,
    SetZoneEmergenza,
    StartLoadingTipologieEmergenza,
    StartLoadingZoneEmergenza,
    StopLoadingTipologieEmergenza,
    StopLoadingZoneEmergenza,
    UpdateModuliMobConsolidamentoZonaEmergenza,
    UpdateModuliMobImmediataZonaEmergenza,
    UpdateModuliMobPotIntZonaEmergenza,
} from '../../actions/zone-emergenza/zone-emergenza.actions';
import { ZonaEmergenzaForm } from '../../../interface/zona-emergenza-form.interface';
import { Localita } from '../../../../../shared/model/localita.model';
import { makeCopy, makeID } from '../../../../../shared/helper/function-generiche';
import { AnnullaZonaEmergenzaForm } from '../../../interface/annulla-zona-emergenza-form.interface';
import { AllertaCONZonaEmergenzaForm } from '../../../interface/allerta-CON-zona-emergenza-form.interface';
import { CraZonaEmergenzaForm } from '../../../interface/cra-zona-emergenza-form.interface';
import { Doa } from '../../../interface/doa.interface';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { Cra } from '../../../interface/cra.interface';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { DoaForm } from '../../../interface/doa-form.interface';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../../../shared/enum/routes-path.enum';
import { Pca } from '../../../interface/pca.interface';
import { PcaForm } from '../../../interface/pca-form.interface';
import { ResetForm, UpdateFormValue } from '@ngxs/form-plugin';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';

export interface ZoneEmergenzaStateModel {
    zoneEmergenza: ZonaEmergenza[];
    zonaEmergenzaById: ZonaEmergenza;
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
    craZonaEmergenzaForm: {
        model: CraZonaEmergenzaForm,
        dirty: boolean,
        status: string,
        errors: any
    };
    doaForm: {
        model: DoaForm,
        dirty: boolean,
        status: string,
        errors: any
    };
    pcaForm: {
        model: PcaForm,
        dirty: boolean,
        status: string,
        errors: any
    };
    doa: Doa[];
    pca: {
        pca: Pca;
        codiceDoa: string;
    }[];
    loadingZoneEmergenza: boolean;
    loadingTipologieEmergenza: boolean;
    mappaActive: boolean;
}

export const ZoneEmergenzaStateModelDefaults: ZoneEmergenzaStateModel = {
    zoneEmergenza: null,
    zonaEmergenzaById: null,
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
    craZonaEmergenzaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    doaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    pcaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    doa: [],
    pca: [],
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
    static zonaEmergenzaById(state: ZoneEmergenzaStateModel): ZonaEmergenza {
        return state.zonaEmergenzaById;
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

    @Selector()
    static doa(state: ZoneEmergenzaStateModel): Doa[] {
        return state.doa;
    }

    @Selector()
    static pca(state: ZoneEmergenzaStateModel): { pca: Pca, codiceDoa: string }[] {
        return state.pca;
    }

    @Action(GetZoneEmergenza)
    getZoneEmergenza({ dispatch }: StateContext<ZoneEmergenzaStateModel>, action: GetZoneEmergenza): void {
        dispatch(new StartLoadingZoneEmergenza());
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: 7
        };
        this.zoneEmergenzaService.getZoneEmergenza(pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetZoneEmergenza(response.dataArray),
                new StopLoadingZoneEmergenza()
            ]);
        }, () => {
            dispatch(new StopLoadingZoneEmergenza());
        });
    }

    @Action(SetZoneEmergenza)
    setZoneEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: SetZoneEmergenza): void {
        patchState({
            zoneEmergenza: action.zoneEmergenza
        });
    }

    @Action(GetZonaEmergenzaById)
    getZonaEmergenzaById({ dispatch }: StateContext<ZoneEmergenzaStateModel>, action: GetZonaEmergenzaById): void {
        dispatch(new StartLoadingZoneEmergenza());
        this.zoneEmergenzaService.getById(action.id).subscribe((response: { emergenza: ZonaEmergenza }) => {
            if (response?.emergenza) {
                dispatch([
                    new SetZonaEmergenzaById(response.emergenza),
                    new StopLoadingZoneEmergenza()
                ]);
            } else {
                dispatch([
                    new Navigate(['/' + RoutesPath.ZoneEmergenza]),
                    new StopLoadingZoneEmergenza()
                ]);
            }
        }, () => {
            dispatch(new StopLoadingZoneEmergenza());
        });
    }

    @Action(SetZonaEmergenzaById)
    setZonaEmergenzaById({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: SetZonaEmergenzaById): void {
        patchState({
            zonaEmergenzaById: action.zonaEmergenza
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
    getTipologieEmergenza({ dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new StartLoadingTipologieEmergenza());
        this.zoneEmergenzaService.getTipologieEmergenze().subscribe((response: { listaTipologie: TipologiaEmergenza[] }) => {
            dispatch([
                new SetTipologieEmergenza(response.listaTipologie),
                new StopLoadingTipologieEmergenza()
            ]);
        }, () => {
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
        const dirigenti = [
            formValue.comandanteRegionale,
            formValue.responsabileDistrettoAreaColpita,
            formValue.responsabile,
            formValue.responsabileCampiBaseMezziOperativi,
            formValue.responsabileGestionePersonaleContratti,
        ];
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
                'RM',
                'Lazio'
            ),
            null,
            false,
            false,
            dirigenti
        );
        this.zoneEmergenzaService.add(zonaEmergenza).subscribe((response: ZonaEmergenza) => {
            const paramsRequestTipologieModuli = {
                id: response.id,
                tipologieModuli: formValue.tipologieModuli
            };
            this.zoneEmergenzaService.requestTipologieModuli(paramsRequestTipologieModuli).subscribe(() => {
                dispatch([
                    new GetZoneEmergenza(),
                    new ResetZonaEmergenzaForm(),
                    new SetMappaActiveValue(false),
                    new StopLoadingZoneEmergenza()
                ]);
            }, () => {
                dispatch([
                    new ResetZonaEmergenzaForm(),
                    new StopLoadingZoneEmergenza()
                ]);
            });
        }, () => {
            dispatch([
                new ResetZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        });
    }

    @Action(EditZonaEmergenza)
    editZonaEmergenza({ getState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: EditZonaEmergenza): void {
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
        const dirigenti = [
            formValue.comandanteRegionale,
            formValue.responsabileDistrettoAreaColpita,
            formValue.responsabile,
            formValue.responsabileCampiBaseMezziOperativi,
            formValue.responsabileGestionePersonaleContratti,
        ];
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
                'RM',
                'Lazio'
            ),
            formValue.listaEventi,
            formValue.annullata,
            formValue.allertata,
            dirigenti,
            formValue.listaModuliImmediata,
            formValue.listaModuliConsolidamento,
            formValue.listaModuliPotInt
        );

        this.zoneEmergenzaService.edit(zonaEmergenza).subscribe(() => {
            dispatch([
                new GetZoneEmergenza(),
                new ResetZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        }, () => {
            dispatch([
                new ResetZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        });
    }

    @Action(SetEventoRichiestaGestitoZonaEmergenza)
    setEventoRichiestaGestitoZonaEmergenza({ getState }: StateContext<ZoneEmergenzaStateModel>, action: SetEventoRichiestaGestitoZonaEmergenza): void {
        const state = getState();
        const zonaEmergenza = state.zonaEmergenzaById;
        const istanteEentoGestito = action.eventoGestito?.istante;

        if (zonaEmergenza && istanteEentoGestito) {
            const obj = {
                id: zonaEmergenza.id,
                richiestaEmergenza: {
                    istante: istanteEentoGestito
                }
            };
            this.zoneEmergenzaService.setEventoGestito(obj).subscribe(() => {

            }, () => {
            });
        }
    }

    @Action(UpdateModuliMobImmediataZonaEmergenza)
    updateModuliMobImmediataZonaEmergenza({ dispatch }: StateContext<ZoneEmergenzaStateModel>, action: UpdateModuliMobImmediataZonaEmergenza): void {
        dispatch(new StartLoadingZoneEmergenza());

        const zonaEmergenzaValue = action.zonaEmergenza;
        const moduliMobImmediata = action.moduliMobImmediata;
        const zonaEmergenza = new ZonaEmergenza(
            zonaEmergenzaValue.id,
            zonaEmergenzaValue.codEmergenza,
            zonaEmergenzaValue.codComandoRichiedente,
            zonaEmergenzaValue.descrizione,
            zonaEmergenzaValue.tipologia,
            new Localita(
                {
                    latitudine: zonaEmergenzaValue.localita.coordinate.latitudine,
                    longitudine: zonaEmergenzaValue.localita.coordinate.longitudine
                },
                zonaEmergenzaValue.localita.indirizzo,
                null,
                null,
                null,
                null,
                null,
                null,
                zonaEmergenzaValue.localita.provincia,
                zonaEmergenzaValue.localita.regione
            ),
            zonaEmergenzaValue.listaEventi,
            zonaEmergenzaValue.annullata,
            zonaEmergenzaValue.allertata,
            zonaEmergenzaValue.dirigenti,
            moduliMobImmediata,
            zonaEmergenzaValue.listaModuliConsolidamento,
            zonaEmergenzaValue.listaModuliPotInt
        );

        this.zoneEmergenzaService.edit(zonaEmergenza).subscribe(() => {
            if (action.eventoGestito) {
                dispatch(new SetEventoRichiestaGestitoZonaEmergenza());
            }

            dispatch([
                new GetZoneEmergenza(),
                new StopLoadingZoneEmergenza()
            ]);
        }, () => {
            dispatch([
                new StopLoadingZoneEmergenza()
            ]);
        });
    }

    @Action(UpdateModuliMobPotIntZonaEmergenza)
    updateModuliMobPotIntZonaEmergenza({ dispatch }: StateContext<ZoneEmergenzaStateModel>, action: UpdateModuliMobPotIntZonaEmergenza): void {
        dispatch(new StartLoadingZoneEmergenza());
        const zonaEmergenzaValue = action.zonaEmergenza;
        const moduliMobPotInt = action.moduliMobPotInt;
        const zonaEmergenza = new ZonaEmergenza(
            zonaEmergenzaValue.id,
            zonaEmergenzaValue.codEmergenza,
            zonaEmergenzaValue.codComandoRichiedente,
            zonaEmergenzaValue.descrizione,
            zonaEmergenzaValue.tipologia,
            new Localita(
                {
                    latitudine: zonaEmergenzaValue.localita.coordinate.latitudine,
                    longitudine: zonaEmergenzaValue.localita.coordinate.longitudine
                },
                zonaEmergenzaValue.localita.indirizzo,
                null,
                null,
                null,
                null,
                null,
                null,
                zonaEmergenzaValue.localita.provincia,
                zonaEmergenzaValue.localita.regione
            ),
            zonaEmergenzaValue.listaEventi,
            zonaEmergenzaValue.annullata,
            zonaEmergenzaValue.allertata,
            zonaEmergenzaValue.dirigenti,
            zonaEmergenzaValue.listaModuliImmediata,
            zonaEmergenzaValue.listaModuliConsolidamento,
            moduliMobPotInt
        );
        this.zoneEmergenzaService.edit(zonaEmergenza).subscribe(() => {
            dispatch([
                new GetZoneEmergenza(),
                new StopLoadingZoneEmergenza()
            ]);
        }, () => {
            dispatch([
                new StopLoadingZoneEmergenza()
            ]);
        });
    }

    @Action(UpdateModuliMobConsolidamentoZonaEmergenza)
    updateModuliMobConsolidamentoZonaEmergenza({ getState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: UpdateModuliMobConsolidamentoZonaEmergenza): void {
        dispatch(new StartLoadingZoneEmergenza());
        const state = getState();

        // Costruzione oggetto CRA
        const craZonaEmergenzaFormValue = state.craZonaEmergenzaForm.model as CraZonaEmergenzaForm;
        const cra = {
            nome: craZonaEmergenzaFormValue.nome,
            coordinate: new Coordinate(+craZonaEmergenzaFormValue.latitudine, +craZonaEmergenzaFormValue.longitudine),
            indirizzo: craZonaEmergenzaFormValue.indirizzo,
            listaDoa: craZonaEmergenzaFormValue.listaDoa
        } as Cra;

        const zonaEmergenzaValue = action.zonaEmergenza;
        const moduliMobConsolidamento = action.moduliMobConsolidamento;
        const zonaEmergenza = new ZonaEmergenza(
            zonaEmergenzaValue.id,
            zonaEmergenzaValue.codEmergenza,
            zonaEmergenzaValue.codComandoRichiedente,
            zonaEmergenzaValue.descrizione,
            zonaEmergenzaValue.tipologia,
            new Localita(
                {
                    latitudine: zonaEmergenzaValue.localita.coordinate.latitudine,
                    longitudine: zonaEmergenzaValue.localita.coordinate.longitudine
                },
                zonaEmergenzaValue.localita.indirizzo,
                null,
                null,
                null,
                null,
                null,
                null,
                zonaEmergenzaValue.localita.provincia,
                zonaEmergenzaValue.localita.regione
            ),
            zonaEmergenzaValue.listaEventi,
            zonaEmergenzaValue.annullata,
            zonaEmergenzaValue.allertata,
            zonaEmergenzaValue.dirigenti,
            zonaEmergenzaValue.listaModuliImmediata,
            moduliMobConsolidamento,
            zonaEmergenzaValue.listaModuliPotInt,
            cra
        );
        this.zoneEmergenzaService.edit(zonaEmergenza).subscribe(() => {
            dispatch([
                new GetZoneEmergenza(),
                new StopLoadingZoneEmergenza()
            ]);
        }, () => {
            dispatch([
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
        this.zoneEmergenzaService.annulla(params).subscribe(() => {
            dispatch([
                new GetZoneEmergenza(),
                new ResetAnnullaZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        }, () => {
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
        this.zoneEmergenzaService.allertaEmergenzaCON(params).subscribe(() => {
            dispatch([
                new GetZoneEmergenza(),
                new ResetAllertaCONZonaEmergenzaForm(),
                new StopLoadingZoneEmergenza()
            ]);
        }, () => {
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

    @Action(ResetDoaForm)
    resetDoaForm({ dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new ResetForm({ path: 'zoneEmergenza.doaForm' }));
    }

    @Action(AddDoa)
    addDoa({ getState, setState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: AddDoa): void {
        let state = getState();
        const craZonaEmergenzaFormValue = state.craZonaEmergenzaForm.model;
        const doa = action.doa;
        doa.codice = craZonaEmergenzaFormValue.nome.replace(' ', '') + '-' + makeID(10);
        setState(
            patch({
                doa: append<DoaForm>([action.doa])
            })
        );
        state = getState();
        const doaList = state.craZonaEmergenzaForm.model.listaDoa;
        const newDoaList = [...doaList, ...state.doa];
        dispatch(new UpdateFormValue({ value: { listaDoa: newDoaList }, path: 'zoneEmergenza.craZonaEmergenzaForm' }));
    }

    @Action(DeleteDoa)
    deleteDoa({ setState }: StateContext<ZoneEmergenzaStateModel>, action: DeleteDoa): void {
        const codice = action.codice;
        setState(
            patch({
                doa: removeItem<Doa>((d: Doa) => d.codice === codice)
            })
        );
    }

    @Action(ResetPcaForm)
    resetPcaForm({ dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new ResetForm({ path: 'zoneEmergenza.pcaForm' }));
    }

    @Action(AddPca)
    addPca({ getState, setState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: AddPca): void {
        const pca = action.pca;
        pca.codice = action.codiceDoa + '-' + makeID(10);
        setState(
            patch({
                pca: append([{ pca: action.pca, codiceDoa: action.codiceDoa }])
            })
        );
        const state = getState();
        const newPcaList = state.pca as { pca: Pca; codiceDoa: string; }[];
        const doaList = state.craZonaEmergenzaForm.model.listaDoa;
        const doaListCopy = makeCopy(doaList);
        doaListCopy.forEach((doa: Doa) => {
            newPcaList.forEach((p: { pca: Pca; codiceDoa: string; }) => {
                if (doa.codice === p.codiceDoa) {
                    if (!doa.listaPca) {
                        doa.listaPca = [];
                    }
                    doa.listaPca.push(p.pca);
                }
            });
        });
        dispatch(new UpdateFormValue({ value: { listaDoa: doaListCopy }, path: 'zoneEmergenza.craZonaEmergenzaForm' }));
    }

    @Action(DeletePca)
    deletePca({ setState }: StateContext<ZoneEmergenzaStateModel>, action: DeletePca): void {
        const codice = action.codice;
        setState(
            patch({
                pca: removeItem((p: { pca: Pca, codiceDoa: string }) => p.pca.codice === codice)
            })
        );
    }

    @Action(SaveCraZonaEmergenza)
    saveCraZonaEmergenza({ getState, dispatch }: StateContext<ZoneEmergenzaStateModel>): void {
        dispatch(new StartLoadingZoneEmergenza());
        const state = getState();

        // Costruzione oggetto CRA
        const craZonaEmergenzaFormValue = state.craZonaEmergenzaForm.model as CraZonaEmergenzaForm;
        const cra = {
            nome: craZonaEmergenzaFormValue.nome,
            coordinate: new Coordinate(+craZonaEmergenzaFormValue.latitudine, +craZonaEmergenzaFormValue.longitudine),
            indirizzo: craZonaEmergenzaFormValue.indirizzo,
            listaDoa: craZonaEmergenzaFormValue.listaDoa
        } as Cra;

        const zonaEmergenzaValue = state.zonaEmergenzaById;
        const zonaEmergenza = new ZonaEmergenza(
            zonaEmergenzaValue.id,
            zonaEmergenzaValue.codEmergenza,
            zonaEmergenzaValue.codComandoRichiedente,
            zonaEmergenzaValue.descrizione,
            zonaEmergenzaValue.tipologia,
            new Localita(
                {
                    latitudine: zonaEmergenzaValue.localita.coordinate.latitudine,
                    longitudine: zonaEmergenzaValue.localita.coordinate.longitudine
                },
                zonaEmergenzaValue.localita.indirizzo,
                null,
                null,
                null,
                null,
                null,
                null,
                zonaEmergenzaValue.localita.provincia,
                zonaEmergenzaValue.localita.regione
            ),
            zonaEmergenzaValue.listaEventi,
            zonaEmergenzaValue.annullata,
            zonaEmergenzaValue.allertata,
            zonaEmergenzaValue.dirigenti,
            zonaEmergenzaValue.listaModuliImmediata,
            zonaEmergenzaValue.listaModuliConsolidamento,
            zonaEmergenzaValue.listaModuliPotInt,
            cra
        );
        this.zoneEmergenzaService.edit(zonaEmergenza).subscribe(() => {
            dispatch([
                new GetZoneEmergenza(),
                new StopLoadingZoneEmergenza(),
                new ShowToastr(ToastrType.Success, 'Gestione Emergenza', 'Salvataggio avvenuto con successo', 3),
            ]);
        }, () => {
            dispatch([
                new StopLoadingZoneEmergenza(),
                new ShowToastr(ToastrType.Error, 'Gestione Emergenza', 'Errore nel salvataggio', 3),
            ]);
        });
    }
}
