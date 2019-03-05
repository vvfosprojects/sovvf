import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { CentroMappaService } from '../../../../../core/service/maps-service';
import { GetCentroMappa, SetCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { Coordinate } from '../../../../../shared/model/coordinate.model';

export interface CentroMappaStateModel {
    centroMappa: CentroMappa;
}

export const CentroMappaStateDefaults: CentroMappaStateModel = {
    centroMappa: null
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

    @Action(GetCentroMappa)
    getCentroMappa({ dispatch }: StateContext<CentroMappaStateModel>) {
        this._centro.getCentroMappa().subscribe((result: CentroMappa) => {
            dispatch(new SetCentroMappa(result));
        });
    }

    @Action(SetCentroMappa)
    setCentroMappa({ getState, patchState }: StateContext<CentroMappaStateModel>, action: SetCentroMappa) {
        const state = getState();
        patchState({
            ...state,
            centroMappa: action.centroMappa
        });
    }

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

}
