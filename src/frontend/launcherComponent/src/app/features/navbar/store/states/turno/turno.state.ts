import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Turno } from '../../../turno/turno.model';
import { ClearTurnoExtra, GetTurnoExtra, SetTurno, SetTurnoExtra } from '../../actions/turno/turno.actions';
import { TurnoExtraService } from '../../../../../core/service/turno-service/turno-extra.service';
import { TurnoExtra } from '../../../turno/turno-extra.model';
import { calcolaTurno } from '../../../../../shared/helper/calcola-turno';

export interface TurniStateModel {
    turno: Turno;
    turnoExtra: TurnoExtra;
}

export const TurniStateDefaults: TurniStateModel = {
    turno: null,
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
    static turno(state: TurniStateModel) {
        return state.turno;
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

    @Action(SetTurno)
    setTurno({ patchState, dispatch }: StateContext<TurniStateModel>) {
        dispatch(new GetTurnoExtra());
        const turno = calcolaTurno();
        patchState({
            turno: turno
        });
    }
}
