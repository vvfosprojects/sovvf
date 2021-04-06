import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    RemoveChiuseRichiesta,
    RemoveFakeStatoRichiesta, RemovePeriodoChiuse, ResetFiltriStatiZone, ResetFiltriZoneSelezionate, SetChiuseRichiesta,
    SetFakeStatoRichiesta, SetPeriodoChiuse,
    SetZoneEmergenza,
    SetZoneEmergenzaSelezionate
} from '../../actions/filterbar/zone-emergenza.actions';
import { patch } from '@ngxs/store/operators';


export interface ZoneEmergenzaStateModel {
    zoneEmergenza: any[];
    zoneEmergenzaSelezionate: string[];
    fakeStatoRichiesta: string[];
    chiuse: string[];
    periodoChiuseChiamate: any;
    periodoChiusiInterventi: any;
    disableFiltri: boolean;
}

export const zoneEmergenzaStateDefaults: ZoneEmergenzaStateModel = {
    zoneEmergenza: [
        {
            name: 'test fake number 1',
            selected: false,
        },
        {
            name: 'test fake number 2',
            selected: false,
        }
    ],
    zoneEmergenzaSelezionate: [],
    fakeStatoRichiesta: [],
    chiuse: [],
    periodoChiuseChiamate: {
        da: null,
        a: null,
        data: null,
        turno: null,
    },
    periodoChiusiInterventi: {
        da: null,
        a: null,
        data: null,
        turno: null,
    },
    disableFiltri: false,
};

@Injectable()
@State<ZoneEmergenzaStateModel>({
    name: 'zoneEmergenza',
    defaults: zoneEmergenzaStateDefaults
})
export class ZoneEmergenzaState {

    constructor() {
    }

    @Selector()
    static periodoChiuseChiamate(state: ZoneEmergenzaStateModel): any {
        return state.periodoChiuseChiamate;
    }

    @Selector()
    static periodoChiusiInterventi(state: ZoneEmergenzaStateModel): any {
        return state.periodoChiusiInterventi;
    }

    @Selector()
    static fakeStatoRichiesta(state: ZoneEmergenzaStateModel): string[] {
        return state.fakeStatoRichiesta;
    }

    @Selector()
    static chiuse(state: ZoneEmergenzaStateModel): string[] {
        return state.chiuse;
    }

    @Selector()
    static zoneEmergenza(state: ZoneEmergenzaStateModel): any[] {
        return state.zoneEmergenza;
    }

    @Selector()
    static disableFiltri(state: ZoneEmergenzaStateModel): boolean {
        return !!(state.chiuse && state.chiuse.length);
    }

    @Selector()
    static zoneEmergenzaSelezionate(state: ZoneEmergenzaStateModel): string[] {
        return state.zoneEmergenzaSelezionate;
    }

    @Action(SetZoneEmergenza)
    setZoneEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        /*
        const zoneEmergenza: any = {
          name: action.name
        };
        patchState({
          zoneEmergenza,
        });
        */
    }

    @Action(SetPeriodoChiuse)
    setPeriodoChiuse({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        const periodoChiuse = {
            da: action.periodo.da,
            a: action.periodo.a,
            data: action.periodo.data,
            turno: action.periodo.turno,
        };
        if (action.tipologiaRichiesta === 'Chiamate') {
            patchState({
                periodoChiuseChiamate: periodoChiuse
            });
        } else if (action.tipologiaRichiesta === 'Interventi') {
            patchState({
                periodoChiusiInterventi: periodoChiuse
            });
        }

    }

    @Action(RemovePeriodoChiuse)
    removePeriodoChiuse({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        const periodoChiuse = {
            da: null,
            a: null,
            data: null,
            turno: null,
        };
        if (action.tipologiaRichiesta === 'Chiamate') {
            patchState({
                periodoChiuseChiamate: periodoChiuse
            });
        } else if (action.tipologiaIntervento === 'Interventi') {
            patchState({
                periodoChiusiInterventi: periodoChiuse
            });
        } else {
            patchState({
                periodoChiuseChiamate: zoneEmergenzaStateDefaults.periodoChiuseChiamate,
                periodoChiusiInterventi: zoneEmergenzaStateDefaults.periodoChiusiInterventi
            });
        }
    }

    @Action(SetFakeStatoRichiesta)
    setFakeStatoRichiesta({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        const state = getState();
        const singleValue = action.zoneEmergenza;
        const arrayStati = [...state.fakeStatoRichiesta];
        arrayStati.push(singleValue);
        patchState({
            fakeStatoRichiesta: arrayStati,
        });
    }

    @Action(RemoveFakeStatoRichiesta)
    removeFakeStatoRichiesta({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        const state = getState();
        const singleValue = action.zoneEmergenza;
        const arrayStati = [...state.fakeStatoRichiesta];
        const arrayStatiFiltrati = arrayStati.filter(x => x !== singleValue);
        patchState({
            fakeStatoRichiesta: arrayStatiFiltrati,
        });
    }

    @Action(SetChiuseRichiesta)
    setChiuseRichiesta({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        const state = getState();
        const singleValue = action.chiuse;
        const arrayStati = [...state.chiuse];
        if (!arrayStati.includes(singleValue)) {
            arrayStati.push(singleValue);
        }
        patchState({
            chiuse: arrayStati,
        });
    }

    @Action(RemoveChiuseRichiesta)
    removeChiuseRichiesta({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        const state = getState();
        const singleValue = action.chiuse;
        const arrayStati = [...state.chiuse];
        const arrayStatiFiltrati = arrayStati.filter(x => x !== singleValue);
        patchState({
            chiuse: arrayStatiFiltrati,
        });
    }

    @Action(SetZoneEmergenzaSelezionate)
    setZoneEmergenzaSelezionate({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        const state = getState();
        patchState({
            ...state,
            zoneEmergenzaSelezionate: action.zoneEmergenza,
        });
    }

    @Action(ResetFiltriStatiZone)
    resetFiltriStatiZone({ setState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        setState(zoneEmergenzaStateDefaults);
    }

    @Action(ResetFiltriZoneSelezionate)
    resetFiltriZoneSelezionate({ setState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
        setState(
            patch({
                zoneEmergenzaSelezionate: zoneEmergenzaStateDefaults.zoneEmergenzaSelezionate,
            })
        );
    }
}
