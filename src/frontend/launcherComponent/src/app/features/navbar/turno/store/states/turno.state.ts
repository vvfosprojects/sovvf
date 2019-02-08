import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { Turno } from '../../turno.model';

// Action
import { GetTurno } from '../actions/turno.actions';
import { TurnoService } from '../../../navbar-service/turno-service/turno.service';

export interface TurniStateModel {
    turno: Turno;
}

export const UnitaOperativeStateDefaults: TurniStateModel = {
    turno: null
};

@State<TurniStateModel>({
    name: 'turno',
    defaults: UnitaOperativeStateDefaults
})
export class TurnoState {

    constructor(private _turni: TurnoService) { }

    // SELECTORS
    @Selector()
    static turno(state: TurniStateModel) {
        return state.turno;
    }

    // GET
    @Action(GetTurno)
    getTurno({ getState, patchState }: StateContext<TurniStateModel>) {
        const state = getState();
        let turno = state.turno;

        this._turni.getTurni().subscribe((t: Turno) => {
            turno = t;
        });

        patchState({
            ...state,
            turno: turno
        });
    }
}
