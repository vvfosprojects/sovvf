import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CentroMappa } from '../../maps-model/centro-mappa.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import {
    ClearCentroMappa,
    GetInitCentroMappa,
    GetInitCoordCentroMappa,
    GetInitZoomCentroMappa,
    SetCentroMappa,
    SetCoordCentroMappa,
    SetInitCentroMappa,
    SetZoomCentroMappa, SetZoomCentroMappaByKilometers
} from '../actions/centro-mappa.actions';
import { Injectable } from '@angular/core';

export interface CentroMappaStateModel {
    centroMappa: CentroMappa;
    initCentroMappa: CentroMappa;
}

export const CentroMappaStateDefaults: CentroMappaStateModel = {
    centroMappa: null,
    initCentroMappa: null,
};

@Injectable()
@State<CentroMappaStateModel>({
    name: 'centroMappa',
    defaults: CentroMappaStateDefaults
})

export class CentroMappaState {

    @Selector()
    static centroMappa(state: CentroMappaStateModel): CentroMappa {
        return state.centroMappa;
    }

    @Selector()
    static zoomCentroMappa(state: CentroMappaStateModel): number {
        return state.centroMappa.zoom;
    }

    @Selector()
    static coordCentroMappa(state: CentroMappaStateModel): Coordinate {
        return state.centroMappa.coordinateCentro;
    }

    constructor() {
    }

    /**
     * Imposta lo stato iniziale del centro Mappa
     * @param: getState
     * @param: patchState
     * @param: action
     */
    @Action(SetInitCentroMappa)
    setInitCentroMappa({ patchState, dispatch }: StateContext<CentroMappaStateModel>, action: SetInitCentroMappa): void {
        patchState({
            initCentroMappa: action.centroMappa
        });
        dispatch(new SetCentroMappa(action.centroMappa));
    }

    /**
     * Imposta lo stato attuale del centro Mappa
     * @param: getState
     * @param: patchState
     * @param: action
     */
    @Action(SetCentroMappa)
    setCentroMappa({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetCentroMappa): void {
        patchState({
            centroMappa: action.centroMappa
        });
    }

    /**
     * Imposta lo stato attuale del centro Mappa (solo il livello di zoom)
     * @param: getState
     * @param: patchState
     * @param: action
     */
    @Action(SetZoomCentroMappa)
    setZoomCentroMappa({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetZoomCentroMappa): void {
        const state = getState();
        patchState({
            ...state,
            centroMappa: {
                coordinateCentro: state.centroMappa.coordinateCentro,
                zoom: action.zoom
            }
        });
    }

    /**
     * Imposta lo stato attuale del centro Mappa (solo il livello di zoom) calcolandolo in base ai km
     * @param: getState
     * @param: patchState
     * @param: action
     */
    @Action(SetZoomCentroMappaByKilometers)
    setZoomCentroMappaByKilometers({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetZoomCentroMappaByKilometers): void {
        const state = getState();
        let zoom: number;
        const totalKilometers = action.totalKilometers;
        if (totalKilometers < 2) {
            zoom = 17;
        } else if (totalKilometers < 5) {
            zoom = 15;
        } else if (totalKilometers < 15) {
            zoom = 14;
        } else if (totalKilometers < 25) {
            zoom = 13;
        } else if (totalKilometers < 50) {
            zoom = 11;
        } else if (totalKilometers < 150) {
            zoom = 9;
        } else if (totalKilometers < 200) {
            zoom = 7;
        } else {
            zoom = 6;
        }
        patchState({
            ...state,
            centroMappa: {
                coordinateCentro: state.centroMappa.coordinateCentro,
                zoom
            }
        });
    }

    /**
     * Imposta lo stato attuale del centro Mappa (solo le coordinate)
     * @param: getState
     * @param: patchState
     * @param: action
     */
    @Action(SetCoordCentroMappa)
    setCoordCentroMappa({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetCoordCentroMappa): void {
        const state = getState();
        patchState({
            ...state,
            centroMappa: {
                coordinateCentro: action.coordinate,
                zoom: state.centroMappa.zoom
            }
        });
    }

    /**
     * Recupera lo stato iniziale del centro Mappa e dispatcha l'azione per fare il relativo set
     * @param: getState
     * @param: dispatch
     */
    @Action(GetInitCentroMappa)
    getInitCentroMappa({ getState, dispatch }: StateContext<CentroMappaStateModel>): void {
        const state = getState();
        dispatch(new SetCentroMappa(state.initCentroMappa));
    }

    /**
     * Recupera lo stato iniziale del centro Mappa (solo il livello di zoom) e dispatcha l'azione per fare il relativo set
     * @param: getState
     * @param: dispatch
     */
    @Action(GetInitZoomCentroMappa)
    getInitZoomCentroMappa({ getState, dispatch }: StateContext<CentroMappaStateModel>): void {
        const state = getState();
        dispatch(new SetZoomCentroMappa(state.initCentroMappa?.zoom));
    }

    /**
     * Recupera lo stato iniziale del centro Mappa (solo le coordinate) e dispatcha l'azione per fare il relativo set
     * @param: getState
     * @param: dispatch
     */
    @Action(GetInitCoordCentroMappa)
    getInitCoordCentroMappa({ getState, dispatch }: StateContext<CentroMappaStateModel>): void {
        const state = getState();
        dispatch(new SetCoordCentroMappa(state.initCentroMappa?.coordinateCentro));
    }

    @Action(ClearCentroMappa)
    clearCentroMappa({ patchState }: StateContext<CentroMappaStateModel>): void {
        patchState(CentroMappaStateDefaults);
    }

}
