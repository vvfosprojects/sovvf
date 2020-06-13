import { Action, Selector, State, StateContext } from '@ngxs/store';
import { TurnoCalendario } from '../../turno/turno-calendario.model';
import { ClearTurnoExtra, GetTurnoExtra, SetTurnoExtra, SetTurnoCalendario } from '../actions/turno.actions';
import { TurnoExtraService } from '../../../../core/service/turno-service/turno-extra.service';
import { TurnoExtra } from '../../turno/turno-extra.model';
import { calcolaTurnoCalendario } from '../../../../shared/helper/calcola-turno';

export interface TurniStateModel {
    turnoCalendario: TurnoCalendario;
    turnoExtra: TurnoExtra;
}

export const TurniStateDefaults: TurniStateModel = {
    turnoCalendario: null,
    turnoExtra: null
};

@State<TurniStateModel>({
    name: 'turni',
    defaults: TurniStateDefaults
})
export class TurnoState {

    constructor(private _turniExtra: TurnoExtraService) {
    }

    @Selector()
    static turnoCalendario(state: TurniStateModel) {
        return state.turnoCalendario;
    }

    @Selector()
    static turnoExtra(state: TurniStateModel) {
        return state.turnoExtra;
    }

    @Action(GetTurnoExtra)
    getTurnoExtra({ dispatch }: StateContext<TurniStateModel>) {
        this._turniExtra.getTurni().subscribe((turno: TurnoExtra) => {
            dispatch(new SetTurnoExtra(turno));
        });
    }


    @Action(SetTurnoExtra)
    setTurnoExtra({ patchState }: StateContext<TurniStateModel>, action: SetTurnoExtra) {
        patchState({
            turnoExtra: action.turnoExtra
        });
    }

    @Action(ClearTurnoExtra)
    clearTurnoExtra({ patchState }: StateContext<TurniStateModel>) {
        patchState({
            turnoExtra: TurniStateDefaults.turnoExtra
        });
    }

    @Action(SetTurnoCalendario)
    setTurnoCalendario({ patchState, dispatch }: StateContext<TurniStateModel>) {
        dispatch(new GetTurnoExtra());
        const turnoCalendario = calcolaTurnoCalendario();
        patchState({
            turnoCalendario: turnoCalendario
        });
    }
}
