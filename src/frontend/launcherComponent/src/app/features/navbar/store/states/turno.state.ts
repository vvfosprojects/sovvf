import { Action, Selector, State, StateContext } from '@ngxs/store';
import { TurnoCalendario } from '../../turno/model/turno-calendario.model';
import { ClearTurnoExtra, GetTurnoExtra, SetTurnoExtra, SetTurnoCalendario } from '../actions/turno.actions';
import { TurnoExtraService } from '../../../../core/service/turno-service/turno-extra.service';
import { TurnoExtra } from '../../turno/model/turno-extra.model';
import { calcolaTurnoCalendario } from '../../../../shared/helper/calcola-turno';
import { Injectable } from '@angular/core';

export interface TurniStateModel {
    turnoCalendario: TurnoCalendario;
    turnoExtra: TurnoExtra;
}

export const TurniStateDefaults: TurniStateModel = {
    turnoCalendario: null,
    turnoExtra: null
};

@Injectable()
@State<TurniStateModel>({
    name: 'turni',
    defaults: TurniStateDefaults
})
export class TurnoState {

    constructor(private turnoExtraService: TurnoExtraService) {
    }

    @Selector()
    static turnoCalendario(state: TurniStateModel): TurnoCalendario {
        return state.turnoCalendario;
    }

    @Selector()
    static turnoExtra(state: TurniStateModel): TurnoExtra {
        return state.turnoExtra;
    }

    @Action(GetTurnoExtra)
    getTurnoExtra({ dispatch }: StateContext<TurniStateModel>): void {
        this.turnoExtraService.getTurni().subscribe((turno: TurnoExtra) => {
            dispatch(new SetTurnoExtra(turno));
        });
    }


    @Action(SetTurnoExtra)
    setTurnoExtra({ patchState }: StateContext<TurniStateModel>, action: SetTurnoExtra): void {
        patchState({
            turnoExtra: action.turnoExtra
        });
    }

    @Action(ClearTurnoExtra)
    clearTurnoExtra({ patchState }: StateContext<TurniStateModel>): void {
        patchState({
            turnoExtra: TurniStateDefaults.turnoExtra
        });
    }

    @Action(SetTurnoCalendario)
    setTurnoCalendario({ patchState, dispatch }: StateContext<TurniStateModel>): void {
        dispatch(new GetTurnoExtra());
        const turnoCalendario = calcolaTurnoCalendario();
        patchState({
            turnoCalendario
        });
    }
}
