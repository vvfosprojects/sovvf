import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    ClearRuoliUtenteLoggato,
    SetRuoliUtenteLoggato,
    UpdateRuoliUtenteLoggato
} from '../../actions/ruoli/ruoli.actions';
import { Ruolo } from '../../../model/utente.model';
import { NavbarState } from '../../../../features/navbar/store/states/navbar.state';
import { getRuoliRicorsivo } from '../../../helper/get-ruoli-ricorsivo';

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
    static ruoliFiltrati(state: RuoliUtenteLoggatoStateModel) {
        return state.ruoli.filter((r: Ruolo) => !r.hidden);
    }

    @Selector()
    static localName(state: RuoliUtenteLoggatoStateModel) {
        return state.localName;
    }

    constructor(private store: Store) {
    }

    @Action(SetRuoliUtenteLoggato)
    setRuoliUtenteLoggato({ getState, patchState }: StateContext<RuoliUtenteLoggatoStateModel>, action: SetRuoliUtenteLoggato) {
        const localName = getState().localName;
        patchState({
            ruoli: this.getRuoliFullList(action.ruoliUtenteLoggato)
        });
        sessionStorage.setItem(localName, JSON.stringify(action.ruoliUtenteLoggato));
    }

    @Action(UpdateRuoliUtenteLoggato)
    updateRuoliUtenteLoggato({ getState, patchState }: StateContext<RuoliUtenteLoggatoStateModel>, action: UpdateRuoliUtenteLoggato) {
        const localName = getState().localName;
        patchState({
            ruoli: this.getRuoliFullList(action.ruoliUtenteLoggato)
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

    getRuoliFullList(ruoliRicorsivi: Ruolo[]): Ruolo[] {
        const ruoli: Ruolo[] = [];
        const listaSedi = this.store.selectSnapshot(NavbarState.listaSedi);
        if (ruoliRicorsivi && ruoliRicorsivi.length > 0) {
            ruoliRicorsivi.forEach(ruoloRicorsivo => {
                if (ruoloRicorsivo.ricorsivo) {
                    ruoli.push(...getRuoliRicorsivo(ruoloRicorsivo, listaSedi));
                } else {
                    ruoli.push(ruoloRicorsivo);
                }
            });
        }
        return ruoli;
    }
}
