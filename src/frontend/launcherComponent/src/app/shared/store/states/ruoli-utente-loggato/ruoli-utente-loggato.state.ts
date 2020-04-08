import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearRuoliUtenteLoggato, SetRuoliUtenteLoggato, UpdateRuoliUtenteLoggato } from '../../actions/ruoli/ruoli.actions';
import { Ruolo } from '../../../model/utente.model';

export interface RuoliUtenteLoggatoStateModel {
    ruoli: Ruolo[];
    localName: string;
}

export const ruoliStateModelDefaults: RuoliUtenteLoggatoStateModel = {
    ruoli: [],
    localName: 'ruoliUtenteSO115'
};

@State<RuoliUtenteLoggatoStateModel>({
    name: 'ruoliUtenteLoggato',
    defaults: ruoliStateModelDefaults
})
export class RuoliUtenteLoggatoState {

    @Selector()
    static ruoli(state: RuoliUtenteLoggatoStateModel) {
        return state.ruoli;
    }

    @Selector()
    static localName(state: RuoliUtenteLoggatoStateModel) {
        return state.localName;
    }

    @Action(SetRuoliUtenteLoggato)
    setRuoliUtenteLoggato({ getState, patchState }: StateContext<RuoliUtenteLoggatoStateModel>, action: SetRuoliUtenteLoggato) {
        const localName = getState().localName;
        patchState({
            ruoli: action.ruoliUtenteLoggato
        });
        sessionStorage.setItem(localName, JSON.stringify(action.ruoliUtenteLoggato));
    }

    @Action(UpdateRuoliUtenteLoggato)
    updateRuoliUtenteLoggato({ getState, patchState }: StateContext<RuoliUtenteLoggatoStateModel>, action: UpdateRuoliUtenteLoggato) {
        const localName = getState().localName;
        patchState({
            ruoli: action.ruoliUtenteLoggato
        });
        sessionStorage.setItem(localName, JSON.stringify(action.ruoliUtenteLoggato));
    }

    @Action(ClearRuoliUtenteLoggato)
    clearRuoliUtenteLoggato({ getState, patchState }: StateContext<RuoliUtenteLoggatoStateModel>) {
        const localName = getState().localName;
        patchState({
            ruoli: ruoliStateModelDefaults.ruoli
        });
        sessionStorage.removeItem(localName);
    }
}
