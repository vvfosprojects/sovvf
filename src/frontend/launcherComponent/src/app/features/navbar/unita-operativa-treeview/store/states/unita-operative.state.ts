import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { Sede } from 'src/app/shared/model/sede.model';
import { GetUnitaOperative } from '../actions/unita-operative.actions';
import { UnitaOperativaService } from '../../../navbar-service/unita-operativa-service/unita-operativa.service';

// Action

// State

export interface UnitaOperativeStateModel {
    unitaOperative: Sede[];
}

export const UnitaOperativeStateDefaults: UnitaOperativeStateModel = {
    unitaOperative: []
};

@State<UnitaOperativeStateModel>({
    name: 'unitaOpeartive',
    defaults: UnitaOperativeStateDefaults
})
export class UnitaOperativeState {

    constructor(private _unitaOperative: UnitaOperativaService) { }

    // SELECTORS
    @Selector()
    static unitaOperative(state: UnitaOperativeStateModel) {
        return state.unitaOperative;
    }

    // GET
    @Action(GetUnitaOperative)
    getUnitaOperative({ getState, patchState }: StateContext<UnitaOperativeStateModel>) {
        const state = getState();
        let unitaOperative = [];

        this._unitaOperative.getUnitaOperative().subscribe((unitaO: Sede[]) => {
            unitaOperative = unitaO;
        });

        patchState({
            ...state,
            unitaOperative: unitaOperative
        });
    }
}
