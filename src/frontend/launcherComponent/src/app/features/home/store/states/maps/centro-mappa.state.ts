import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { CentroMappaService } from '../../../../../core/service/maps-service';
import { GetCentroMappa, SetCentroMappa } from '../../actions/maps/centro-mappa.actions';

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
    static centroMappa(state: CentroMappaStateModel) {
        return state.centroMappa;
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
}
