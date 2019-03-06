import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { CentroMappaService } from '../../../../../core/service/maps-service';
import {
    GetCentroMappa,
    GetInitCentroMappa, GetInitCoordCentroMappa, GetInitZoomCentroMappa,
    SetCentroMappa,
    SetCoordCentroMappa,
    SetInitCentroMappa,
    SetZoomCentroMappa
} from '../../actions/maps/centro-mappa.actions';
import { Coordinate } from '../../../../../shared/model/coordinate.model';

export interface CentroMappaStateModel {
    centroMappa: CentroMappa;
    initCentroMappa: CentroMappa;
}

export const CentroMappaStateDefaults: CentroMappaStateModel = {
    centroMappa: null,
    initCentroMappa: null
};

@State<CentroMappaStateModel>({
    name: 'centroMappa',
    defaults: CentroMappaStateDefaults
})

export class CentroMappaState implements NgxsOnInit {

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
        return state.centroMappa.coordinate;
    }

    constructor(private _centro: CentroMappaService) {

    }

    ngxsOnInit(ctx: StateContext<CentroMappaState>) {
        ctx.dispatch(new GetCentroMappa());
    }

    /**
     * Action che esegue il dispatch dello stato del centro Mappa ricevuto dall'API
     * @param dispatch
     */
    @Action(GetCentroMappa)
    getCentroMappa({ dispatch }: StateContext<CentroMappaStateModel>) {
        this._centro.getCentroMappa().subscribe((resultFromApi: CentroMappa) => {
            dispatch(new SetCentroMappa(resultFromApi));
            dispatch(new SetInitCentroMappa(resultFromApi));
        });
    }

    /**
     * Imposta lo stato attuale del centro Mappa
     * @param getState
     * @param patchState
     * @param action
     */
    @Action(SetCentroMappa)
    setCentroMappa({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetCentroMappa) {
        const state = getState();
        if (state.centroMappa) {
            if (action.centroMappa.coordinate.latitudine.toPrecision(5) !== state.centroMappa.coordinate.latitudine.toPrecision(5) &&
                action.centroMappa.coordinate.longitudine.toPrecision(5) !== state.centroMappa.coordinate.longitudine.toPrecision(5)) {
                patchState({
                    ...state,
                    centroMappa: action.centroMappa
                });
            }
        } else {
            patchState({
                ...state,
                centroMappa: action.centroMappa
            });
        }
    }

    /**
     * Imposta lo stato attuale del centro Mappa (solo il livello di zoom)
     * @param getState
     * @param patchState
     * @param action
     */
    @Action(SetZoomCentroMappa)
    setZoomCentroMappa({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetZoomCentroMappa) {
        const state = getState();
        patchState({
            ...state,
            centroMappa: {
                coordinate: state.centroMappa.coordinate,
                zoom: action.zoom
            }
        });
    }

    /**
     * Imposta lo stato attuale del centro Mappa (solo le coordinate)
     * @param getState
     * @param patchState
     * @param action
     */
    @Action(SetCoordCentroMappa)
    setCoordCentroMappa({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetCoordCentroMappa) {
        const state = getState();
        patchState({
            ...state,
            centroMappa: {
                coordinate: action.coordinate,
                zoom: state.centroMappa.zoom
            }
        });
    }

    /**
     * Recupera lo stato iniziale del centro Mappa e dispatcha l'azione per fare il relativo set
     * @param getState
     * @param dispatch
     */
    @Action(GetInitCentroMappa)
    getInitCentroMappa({ getState, dispatch }: StateContext<CentroMappaStateModel>) {
        const state = getState();
        dispatch(new SetCentroMappa(state.initCentroMappa));
    }

    /**
     * Recupera lo stato iniziale del centro Mappa (solo il livello di zoom) e dispatcha l'azione per fare il relativo set
     * @param getState
     * @param dispatch
     */
    @Action(GetInitZoomCentroMappa)
    getInitZoomCentroMappa({ getState, dispatch }: StateContext<CentroMappaStateModel>) {
        const state = getState();
        dispatch(new SetZoomCentroMappa(state.initCentroMappa.zoom));
    }

    /**
     * Recupera lo stato iniziale del centro Mappa (solo le coordinate) e dispatcha l'azione per fare il relativo set
     * @param getState
     * @param dispatch
     */
    @Action(GetInitCoordCentroMappa)
    getInitCoordCentroMappa({ getState, dispatch }: StateContext<CentroMappaStateModel>) {
        const state = getState();
        dispatch(new SetCoordCentroMappa(state.initCentroMappa.coordinate));
    }

    /**
     * Imposta lo stato iniziale del centro Mappa
     * @param getState
     * @param patchState
     * @param action
     */
    @Action(SetInitCentroMappa)
    setInitCentroMappa({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetInitCentroMappa) {
        const state = getState();
        patchState({
            ...state,
            initCentroMappa: action.centroMappa
        });
    }

}
