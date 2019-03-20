import { Action, Selector, State, StateContext } from '@ngxs/store';
// Action
import { GetRuoli, SetRuoli } from '../../actions/ruoli/ruoli.actions';
// Service
import { RuoliService } from '../../../../../core/service/ruoli-service/ruoli-service.service';

export interface RuoliStateModel {
    ruoli: Array<any>;
}

export const RuoliStateDefaults: RuoliStateModel = {
        ruoli: []
    }
;

@State<RuoliStateModel>({
    name: 'ruoli',
    defaults: RuoliStateDefaults
})
export class RuoliState {

    constructor(private _ruoli: RuoliService) {
    }

    // SELECTORS
    @Selector()
    static ruoli(state: RuoliStateModel) {
        return state.ruoli;
    }


    // GET
    @Action(GetRuoli)
    getRuoli({dispatch}: StateContext<RuoliStateModel>) {
        this._ruoli.getRuoli().subscribe((ruoli: Array<any>) => {
            dispatch(new SetRuoli(ruoli));
        });
    }

    // SET
    @Action(SetRuoli)
    setRuoli({getState, patchState}: StateContext<RuoliStateModel>, action: SetRuoli) {
        const state = getState();

        patchState({
            ...state,
            ruoli: action.ruoli
        });
    }
}
