import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    ClearRuoliUtenteLoggato,
    SetRuoliUtenteLoggato,
    UpdateRuoliUtenteLoggato
} from '../../actions/ruoli/ruoli.actions';
import { Ruolo } from '../../../model/utente.model';
import { NavbarState } from '../../../../features/navbar/store/states/navbar.state';
import { getRuoliRicorsivo } from '../../../helper/get-ruoli-ricorsivo';
import { LSNAME } from '../../../../core/settings/config';

export interface RuoliUtenteLoggatoStateModel {
    ruoliPrincipali: Ruolo[];
    ruoli: Ruolo[];
}

export const ruoliStateModelDefaults: RuoliUtenteLoggatoStateModel = {
    ruoliPrincipali: [],
    ruoli: []
};

@State<RuoliUtenteLoggatoStateModel>({
    name: 'ruoliUtenteLoggato',
    defaults: ruoliStateModelDefaults
})
export class RuoliUtenteLoggatoState {

    @Selector()
    static ruoliPrincipali(state: RuoliUtenteLoggatoStateModel) {
        return state.ruoliPrincipali;
    }

    @Selector()
    static ruoli(state: RuoliUtenteLoggatoStateModel) {
        return state.ruoli;
    }

    @Selector()
    static ruoliFiltrati(state: RuoliUtenteLoggatoStateModel) {
        return state.ruoli.filter((r: Ruolo) => !r.hidden);
    }

    constructor(private store: Store) {
    }

    @Action(SetRuoliUtenteLoggato)
    setRuoliUtenteLoggato({ patchState }: StateContext<RuoliUtenteLoggatoStateModel>, action: SetRuoliUtenteLoggato) {
        patchState({
            ruoliPrincipali: action.ruoliUtenteLoggato,
            ruoli: this.getRuoliFullList(action.ruoliUtenteLoggato)
        });
        sessionStorage.setItem(LSNAME.role, JSON.stringify(action.ruoliUtenteLoggato));
    }

    @Action(UpdateRuoliUtenteLoggato)
    updateRuoliUtenteLoggato({ patchState }: StateContext<RuoliUtenteLoggatoStateModel>, action: UpdateRuoliUtenteLoggato) {
        patchState({
            ruoliPrincipali: action.ruoliUtenteLoggato,
            ruoli: this.getRuoliFullList(action.ruoliUtenteLoggato)
        });
        sessionStorage.setItem(LSNAME.role, JSON.stringify(action.ruoliUtenteLoggato));
    }

    @Action(ClearRuoliUtenteLoggato)
    clearRuoliUtenteLoggato({ patchState }: StateContext<RuoliUtenteLoggatoStateModel>) {
        patchState({
            ruoli: ruoliStateModelDefaults.ruoli
        });
        sessionStorage.removeItem(LSNAME.role);
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
