import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetRuoli, SetRuoli } from '../../actions/ruoli/ruoli.actions';
import { RuoliService } from '../../../../../core/service/ruoli-service/ruoli-service.service';

export interface RuoliStateModel {
    ruoli: string[];
}

export const RuoliStateDefaults: RuoliStateModel = {
    ruoli: []
};

@State<RuoliStateModel>({
    name: 'ruoli',
    defaults: RuoliStateDefaults
})
export class RuoliState {

    constructor(private _ruoli: RuoliService) {
    }

    @Selector()
    static ruoli(state: RuoliStateModel) {
        return state.ruoli;
    }

    @Action(GetRuoli)
    getRuoli({ dispatch }: StateContext<RuoliStateModel>) {
        this._ruoli.getRuoli().subscribe((ruoli: Array<string>) => {
            dispatch(new SetRuoli(ruoli));
        });
    }

    @Action(SetRuoli)
    setRuoli({ patchState }: StateContext<RuoliStateModel>, action: SetRuoli) {
        patchState({
            ruoli: action.ruoli
        });
    }
}
